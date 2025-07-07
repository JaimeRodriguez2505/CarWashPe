from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action, api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Count, Q
import logging
import requests
import datetime
from django.conf import settings
from .models import Carro, Empresa, Plan, Customer, Card, Subscription, Reclamo
from .serializer import (
    CarroSerializer, EmpresaSerializer, PlanSerializer, CustomerSerializer, CardSerializer, CreateCardSerializer, SubscriptionSerializer, CreateSubscriptionSerializer, ReclamoSerializer
)
from culqi.client import Culqi
from django.contrib.auth import get_user_model
from rest_framework import serializers

logger = logging.getLogger(__name__)

CULQI_CUSTOMER_URL = "https://api.culqi.com/v2/customers"
CULQI_TOKEN_URL = "https://secure.culqi.com/v2/tokens"
CULQI_SUBSCRIPTION_URL = "https://api.culqi.com/v2/recurrent/subscriptions/create"

# Inicializar el cliente Culqi con las credenciales
culqi = Culqi(
    public_key=settings.CULQI_PUBLIC_KEY,
    private_key=settings.CULQI_PRIVATE_KEY
)

class EmpresaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = EmpresaSerializer
    queryset = Empresa.objects.all()  # <--- Añadido para DRF router

    def get_queryset(self):
        # Devuelve la empresa del usuario si existe, si no, un queryset vacío
        return Empresa.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        # Solo permite crear una empresa si el usuario no tiene una
        if Empresa.objects.filter(usuario=self.request.user).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Ya tienes una empresa registrada.")
        serializer.save(usuario=self.request.user)

    @action(detail=True, methods=['get'])
    def estadisticas(self, request, pk=None):
        """
        Obtiene estadísticas reales de la empresa del usuario actual
        """
        try:
            empresa = self.get_object()
            
            # Verificar que la empresa pertenece al usuario
            if empresa.usuario != request.user:
                return Response(
                    {'error': 'No tienes permisos para ver estas estadísticas.'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Obtener carros de la empresa
            carros = Carro.objects.filter(empresa=empresa)
            
            # Calcular estadísticas
            total_carros = carros.count()
            carros_terminados = carros.filter(estado='terminado').count()
            carros_pendientes = carros.filter(Q(estado='espera') | Q(estado='proceso')).count()
            
            # Calcular ingresos totales (solo carros terminados)
            ingresos_totales = carros.filter(estado='terminado').aggregate(
                total=Sum('precio')
            )['total'] or 0
            
            # Estadísticas por estado
            stats_por_estado = carros.values('estado').annotate(
                cantidad=Count('id')
            ).order_by('estado')
            
            # Carros por mes (últimos 6 meses)
            from django.utils import timezone
            from datetime import timedelta
            hace_6_meses = timezone.now() - timedelta(days=180)
            carros_recientes = carros.filter(dia_llegada__gte=hace_6_meses)
            
            estadisticas = {
                'carros_registrados': total_carros,
                'carros_terminados': carros_terminados,
                'carros_pendientes': carros_pendientes,
                'ingresos_totales': float(ingresos_totales),
                'promedio_por_carro': float(ingresos_totales / carros_terminados) if carros_terminados > 0 else 0,
                'stats_por_estado': list(stats_por_estado),
                'carros_ultimo_mes': carros_recientes.count(),
                'empresa_info': {
                    'nombre': empresa.nombre,
                    'ruc': empresa.ruc,
                    'direccion': empresa.direccion
                }
            }
            
            return Response(estadisticas, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error al obtener estadísticas: {str(e)}")
            return Response(
                {'error': 'Error al obtener las estadísticas.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CarroViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CarroSerializer
    queryset = Carro.objects.all()

    def get_queryset(self):
        return Carro.objects.filter(empresa__usuario=self.request.user)

    def perform_create(self, serializer):
        empresa_id = self.request.data.get('empresa')
        empresa = get_object_or_404(Empresa, id=empresa_id, usuario=self.request.user)
        serializer.save(empresa=empresa)

    def check_permission(self, instance):
        if instance.empresa.usuario != self.request.user:
            return Response({'error': 'No tienes permiso para acceder a este carro.'}, status=status.HTTP_403_FORBIDDEN)
        return None

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        permission_error = self.check_permission(instance)
        if permission_error:
            return permission_error
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        permission_error = self.check_permission(instance)
        if permission_error:
            return permission_error
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        permission_error = self.check_permission(instance)
        if permission_error:
            return permission_error
        return super().destroy(request, *args, **kwargs)

class CulqiPlansViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        Lista los planes disponibles en Culqi. Puedes aplicar filtros usando los parámetros GET.
        """
        if not hasattr(settings, 'CULQI_PRIVATE_KEY'):
            logger.error("CULQI_PRIVATE_KEY no está definido en settings.")
            return Response({'error': 'Culqi private key no configurada.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        url = "https://api.culqi.com/v2/recurrent/plans"

        # Parámetros permitidos para filtrar planes
        allowed_params = [
            'amount', 'status', 'min_amount', 'max_amount',
            'creation_date_from', 'creation_date_to', 
            'limit', 'before', 'after'
        ]

        # Filtrar solo los parámetros válidos y no nulos
        querystring = {k: v for k, v in request.GET.items() if k in allowed_params and v is not None}

        headers = {
            "Authorization": f"Bearer {settings.CULQI_PRIVATE_KEY}",
            "Content-Type": "application/json"
        }

        try:
            response = requests.get(url, headers=headers, params=querystring)
            response.raise_for_status()
            culqi_response = response.json()

            data = culqi_response.get('data')
            if isinstance(data, dict):
                plans = [data]
            elif isinstance(data, list):
                plans = data
            else:
                plans = []

            return Response({
                'plans': plans,
                'paging': culqi_response.get('paging', {}),
                'cursors': culqi_response.get('cursors', {}),
                'remaining_items': culqi_response.get('remaining_items', 0)
            }, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            logger.error(f"Error al realizar la solicitud a Culqi: {e}")
            return Response({'error': 'Error al obtener los planes de Culqi'}, status=status.HTTP_400_BAD_REQUEST)


class CustomerViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CustomerSerializer

    @action(detail=False, methods=['get'])
    def me(self, request):
        try:
            customer = Customer.objects.get(user=request.user)
            return Response({
                'customer_id': customer.culqi_id,
                'data': CustomerSerializer(customer).data
            })
        except Customer.DoesNotExist:
            return Response(
                {"error": "No existe un perfil de cliente para este usuario"},
                status=status.HTTP_404_NOT_FOUND
            )

    def list(self, request):
        try:
            # Buscar el customer asociado al usuario actual
            customer = Customer.objects.get(user=request.user)
            serializer = CustomerSerializer(customer)
            return Response(serializer.data)
        except Customer.DoesNotExist:
            return Response(
                {"error": "No existe un perfil de cliente para este usuario"},
                status=status.HTTP_404_NOT_FOUND
            )

    def create(self, request):
        try:
            data = request.data
            user = request.user
            
            # Verificar si ya existe un customer para este usuario
            if hasattr(user, 'customer'):
                return Response(
                    {"error": "Ya existe un perfil de cliente para este usuario."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Crear customer en Culqi
            headers = {
                "Authorization": f"Bearer {settings.CULQI_PRIVATE_KEY}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(CULQI_CUSTOMER_URL, json=data, headers=headers)
            response.raise_for_status()
            culqi_customer = response.json()

            # Crear customer en nuestra base de datos
            customer_data = {
                'user': user,
                'culqi_id': culqi_customer['id'],
                'address': data.get('address'),
                'address_city': data.get('address_city'),
                'country_code': data.get('country_code'),
                'email': data.get('email'),
                'first_name': data.get('first_name'),
                'last_name': data.get('last_name'),
                'phone_number': data.get('phone_number'),
                'metadata': data.get('metadata', {}),
            }

            if 'creation_date' in culqi_customer:
                creation_timestamp = culqi_customer['creation_date'] / 1000.0
                customer_data['creation_date'] = datetime.datetime.fromtimestamp(creation_timestamp)

            customer = Customer.objects.create(**customer_data)
            return Response(CustomerSerializer(customer).data, status=status.HTTP_201_CREATED)

        except requests.exceptions.RequestException as e:
            logger.error(f"Error al crear el cliente en Culqi: {str(e)}")
            return Response(
                {"error": "No se pudo crear el cliente en Culqi."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error inesperado: {str(e)}")
            return Response(
                {"error": "Ocurrió un error inesperado."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def retrieve(self, request, pk=None):
        try:
            customer = Customer.objects.get(user=request.user)
            return Response(CustomerSerializer(customer).data)
        except Customer.DoesNotExist:
            return Response(
                {"error": "Cliente no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['patch'])
    def update_customer(self, request, pk=None):
        try:
            customer = Customer.objects.get(culqi_id=pk, user=request.user)
            
            # Validar datos requeridos
            required_fields = ['first_name', 'last_name']
            for field in required_fields:
                if not request.data.get(field):
                    return Response(
                        {"error": f"El campo {field} es requerido"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Construir payload solo con campos válidos
            valid_fields = ['address', 'address_city', 'country_code', 
                           'first_name', 'last_name', 'phone_number']
            payload = {
                field: request.data[field] 
                for field in valid_fields 
                if field in request.data and request.data[field]
            }
            
            # Log del payload para debugging
            logger.info(f"Payload para Culqi: {payload}")
            
            headers = {
                "Authorization": f"Bearer {settings.CULQI_PRIVATE_KEY}",
                "Content-Type": "application/json"
            }

            # Actualizar en Culqi
            culqi_response = requests.patch(
                f"{CULQI_CUSTOMER_URL}/{customer.culqi_id}",
                json=payload,
                headers=headers
            )
            
            # Log de respuesta Culqi
            logger.info(f"Respuesta Culqi: {culqi_response.text}")
            
            if not culqi_response.ok:
                culqi_error = culqi_response.json()
                logger.error(f"Error Culqi: {culqi_error}")
                return Response(
                    {"error": culqi_error.get('merchant_message', 'Error al actualizar cliente')},
                    status=culqi_response.status_code
                )

            # Actualizar en BD local
            for key, value in payload.items():
                setattr(customer, key, value)
            customer.save()

            return Response(CustomerSerializer(customer).data)

        except Customer.DoesNotExist:
            return Response(
                {"error": "Cliente no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        except requests.exceptions.RequestException as e:
            logger.error(f"Error de conexión con Culqi: {str(e)}")
            return Response(
                {"error": "Error de conexión con el servicio de pago"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            logger.error(f"Error inesperado: {str(e)}")
            return Response(
                {"error": "Error interno del servidor"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['patch'])
    def edit(self, request):
        try:
            customer = Customer.objects.get(user=request.user)
            
            # Preparar headers para Culqi
            headers = {
                "Authorization": f"Bearer {settings.CULQI_PRIVATE_KEY}",
                "Content-Type": "application/json"
            }
            
            # Construir payload
            payload = {}
            fields = ['address', 'address_city', 'country_code', 'first_name', 
                     'last_name', 'phone_number']
            
            for field in fields:
                if field in request.data:
                    payload[field] = request.data[field]
            
            # Log para debug
            logger.info(f"Actualizando cliente {customer.culqi_id} con payload: {payload}")

            # Actualizar en Culqi
            culqi_response = requests.patch(
                f"{CULQI_CUSTOMER_URL}/{customer.culqi_id}",
                json=payload,
                headers=headers
            )
            culqi_response.raise_for_status()

            # Actualizar en BD local
            for key, value in payload.items():
                setattr(customer, key, value)
            customer.save()

            logger.info(f"Cliente actualizado exitosamente: {customer.culqi_id}")
            return Response(CustomerSerializer(customer).data)

        except Customer.DoesNotExist:
            return Response(
                {"error": "Cliente no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        except requests.exceptions.RequestException as e:
            logger.error(f"Error Culqi: {str(e)}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


CULQI_CARD_URL = "https://api.culqi.com/v2/cards"

class CardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        # Lista las tarjetas del usuario desde la base de datos
        cards = Card.objects.filter(user=request.user)
        serializer = CardSerializer(cards, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        # Consulta una tarjeta específica del usuario
        card = get_object_or_404(Card, pk=pk, user=request.user)
        serializer = CardSerializer(card)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        # Crea una tarjeta en Culqi a partir de customer_id y token_id
        serializer = CreateCardSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        headers = {
            "Authorization": f"Bearer {settings.CULQI_PRIVATE_KEY}",
            "content-type": "application/json"
        }

        payload = {
            "customer_id": data['customer_id'],
            "token_id": data['token_id'],
            "validate": data['validate'],
            "metadata": data.get('metadata', {})
        }

        auth_3DS = data.get('authentication_3DS')
        if auth_3DS and isinstance(auth_3DS, dict) and auth_3DS:
            payload['authentication_3DS'] = auth_3DS

        try:
            response = requests.post(CULQI_CARD_URL, json=payload, headers=headers)
            response.raise_for_status()
            culqi_response = response.json()

            card_id = culqi_response.get('id')
            active = culqi_response.get('active', True)
            customer_id = culqi_response.get('customer_id')
            creation_timestamp = culqi_response.get('creation_date')
            creation_dt = None
            if creation_timestamp:
                creation_dt = datetime.datetime.utcfromtimestamp(creation_timestamp / 1000.0)

            card_obj = Card.objects.create(
                user=request.user,
                card_id=card_id,
                customer_id=customer_id,
                active=active,
                creation_date=creation_dt,
                metadata=culqi_response.get('metadata', {})
            )

            return Response(CardSerializer(card_obj).data, status=status.HTTP_201_CREATED)
        except requests.exceptions.RequestException as e:
            logger.error(f"Error al crear la tarjeta en Culqi: {e}")
            return Response({"error": "No se pudo crear la tarjeta en Culqi."}, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        # Actualiza la tarjeta en Culqi (nuevo token_id y/o metadata)
        card = get_object_or_404(Card, pk=pk, user=request.user)
        token_id = request.data.get('token_id')
        metadata = request.data.get('metadata', {})

        if not token_id and not metadata:
            raise ValidationError("Debe proporcionar al menos token_id o metadata para actualizar.")

        headers = {
            "Authorization": f"Bearer {settings.CULQI_PRIVATE_KEY}",
            "content-type": "application/json"
        }

        payload = {}
        if token_id:
            payload["token_id"] = token_id
        if metadata:
            payload["metadata"] = metadata

        card_url = f"{CULQI_CARD_URL}/{card.card_id}"

        try:
            response = requests.patch(card_url, json=payload, headers=headers)
            response.raise_for_status()
            culqi_response = response.json()

            # Actualizar localmente la tarjeta
            if token_id:
                # No hay un campo específico para token en la tarjeta local,
                # pero si quisieras guardar cambios, podrías modificar metadata.
                pass

            if metadata:
                card.metadata = culqi_response.get('metadata', {})
            card.save()

            return Response(CardSerializer(card).data, status=status.HTTP_200_OK)
        except requests.exceptions.RequestException as e:
            logger.error(f"Error al actualizar la tarjeta en Culqi: {e}")
            return Response({"error": "No se pudo actualizar la tarjeta en Culqi."}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        # Elimina la tarjeta en Culqi y localmente
        card = get_object_or_404(Card, pk=pk, user=request.user)

        headers = {
            "Authorization": f"Bearer {settings.CULQI_PRIVATE_KEY}",
            "content-type": "application/json"
        }

        card_url = f"{CULQI_CARD_URL}/{card.card_id}"

        try:
            response = requests.delete(card_url, headers=headers)
            if response.status_code not in [200,204]:
                return Response({"error": "No se pudo eliminar la tarjeta en Culqi."}, status=status.HTTP_400_BAD_REQUEST)

            card.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except requests.exceptions.RequestException as e:
            logger.error(f"Error al eliminar la tarjeta en Culqi: {e}")
            return Response({"error": "No se pudo eliminar la tarjeta en Culqi."}, status=status.HTTP_400_BAD_REQUEST)
        
        
class SubscriptionViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        try:
            # Obtener customer del usuario actual
            customer = Customer.objects.get(user=request.user)
            
            headers = {
                "Authorization": f"Bearer {settings.CULQI_PRIVATE_KEY}",
                "Content-Type": "application/json"
            }
            
            # Filtrar por customer_id
            querystring = {
                'customer_id': customer.culqi_id
            }
            
            response = requests.get(
                "https://api.culqi.com/v2/recurrent/subscriptions",
                headers=headers,
                params=querystring
            )
            response.raise_for_status()
            return Response(response.json())
            
        except Customer.DoesNotExist:
            return Response(
                {"error": "Cliente no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        except requests.exceptions.RequestException as e:
            logger.error(f"Error al listar suscripciones: {str(e)}")
            return Response(
                {"error": f"Error al obtener suscripciones: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def retrieve(self, request, pk=None):
        try:
            headers = {
                "Authorization": f"Bearer {settings.CULQI_PRIVATE_KEY}"
            }
            response = requests.get(
                f"https://api.culqi.com/v2/recurrent/subscriptions/{pk}",
                headers=headers
            )
            response.raise_for_status()
            return Response(response.json())
        except requests.exceptions.RequestException as e:
            logger.error(f"Error al consultar suscripción: {str(e)}")
            return Response(
                {"error": "Error al obtener la suscripción"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, pk=None):
        try:
            # Verificar que la suscripción pertenece al usuario
            customer = Customer.objects.get(user=request.user)
            headers = {
                "Authorization": f"Bearer {settings.CULQI_PRIVATE_KEY}"
            }
            
            # Primero verificar que la suscripción existe y pertenece al usuario
            response = requests.get(
                f"https://api.culqi.com/v2/recurrent/subscriptions/{pk}",
                headers=headers
            )
            subscription_data = response.json()
            
            if subscription_data.get('customer', {}).get('id') != customer.culqi_id:
                return Response(
                    {"error": "No tienes permiso para cancelar esta suscripción"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Proceder con la cancelación
            response = requests.delete(
                f"https://api.culqi.com/v2/recurrent/subscriptions/{pk}",
                headers=headers
            )
            response.raise_for_status()
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        except Customer.DoesNotExist:
            return Response(
                {"error": "Cliente no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        except requests.exceptions.RequestException as e:
            logger.error(f"Error al cancelar suscripción: {str(e)}")
            return Response(
                {"error": "Error al cancelar la suscripción"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def create(self, request):
        """
        Crea una suscripción en Culqi a partir del card_id y el plan_id,
        indicando que se aceptan términos y condiciones (tyc = True).
        """
        serializer = CreateSubscriptionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        headers = {
            "Authorization": f"Bearer {settings.CULQI_PRIVATE_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "card_id": data['card_id'],
            "plan_id": data['plan_id'],
            "tyc": True,
            "metadata": data.get('metadata', {})
        }

        try:
            response = requests.post(CULQI_SUBSCRIPTION_URL, json=payload, headers=headers)
            response.raise_for_status()
            subscription_data = response.json()

            # Extraer campos
            subscription_id = subscription_data.get('id')
            status_sub = subscription_data.get('status', 3)
            creation_timestamp = subscription_data.get('creation_date')
            next_billing_timestamp = subscription_data.get('next_billing_date')
            # Según la documentación, son timestamps en segundos, no ms
            creation_dt = None
            if creation_timestamp is not None:
                creation_dt = datetime.datetime.fromtimestamp(creation_timestamp)

            next_billing_dt = None
            if next_billing_timestamp is not None:
                next_billing_dt = datetime.datetime.fromtimestamp(next_billing_timestamp)

            # Guardar en la base de datos local
            subscription = Subscription.objects.create(
                user=request.user,
                subscription_id=subscription_id,
                plan_id=data['plan_id'],
                card_id=data['card_id'],
                status=status_sub,
                creation_date=creation_dt,
                next_billing_date=next_billing_dt,
                metadata=subscription_data.get('metadata', {})
            )

            return Response(SubscriptionSerializer(subscription).data, status=status.HTTP_201_CREATED)

        except requests.exceptions.RequestException as e:
            logger.error(f"Error al crear la suscripción en Culqi: {e}")
            return Response({"error": "No se pudo crear la suscripción en Culqi."}, status=status.HTTP_400_BAD_REQUEST)

class ReclamoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReclamoSerializer
    queryset = Reclamo.objects.all()

    def get_queryset(self):
        return Reclamo.objects.filter(usuario=self.request.user).order_by('-fecha')

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class UserAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'is_superuser']

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_users_list(request):
    User = get_user_model()
    users = User.objects.all()
    data = UserAdminSerializer(users, many=True).data
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_reclamos_list(request):
    reclamos = Reclamo.objects.all().order_by('-fecha')
    data = ReclamoSerializer(reclamos, many=True).data
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_customer_id(request):
    customer = Customer.objects.filter(user=request.user).first()
    if not customer or not customer.culqi_id:
        return Response({"error": "No existe un Customer para este usuario."}, status=404)
    return Response({"customer_id": customer.culqi_id}, status=200)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_responder_reclamo(request, pk):
    try:
        reclamo = Reclamo.objects.get(pk=pk)
    except Reclamo.DoesNotExist:
        return Response({'error': 'Reclamo no encontrado'}, status=404)
    respuesta = request.data.get('respuesta')
    estado = request.data.get('estado')
    if respuesta is not None:
        reclamo.respuesta = respuesta
    if estado in ['pendiente', 'atendido', 'cerrado']:
        reclamo.estado = estado
    reclamo.save()
    return Response(ReclamoSerializer(reclamo).data)
