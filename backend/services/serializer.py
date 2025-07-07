from rest_framework import serializers
from .models import Carro, Empresa, Plan, Customer, Card, Subscription, Reclamo

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = ['id', 'nombre', 'ruc', 'direccion']

class CarroSerializer(serializers.ModelSerializer):
    empresa = serializers.PrimaryKeyRelatedField(queryset=Empresa.objects.all(), write_only=True)

    class Meta:
        model = Carro
        fields = ['id', 'placa', 'marca', 'color', 'modelo', 'foto', 'dia_llegada', 'dia_salida', 'numero_telefono', 'precio', 'estado', 'empresa']

    def validate_precio(self, value):
        if value < 0:
            raise serializers.ValidationError("El precio debe ser un número positivo.")
        return value

    def validate_placa(self, value):
        if len(value) < 7:
            raise serializers.ValidationError("La placa debe tener al menos 7 caracteres.")
        return value

    def create(self, validated_data):
        empresa = validated_data.pop('empresa')
        carro = Carro.objects.create(empresa=empresa, **validated_data)
        return carro

    def update(self, instance, validated_data):
        empresa = validated_data.pop('empresa', None)
        if empresa is not None:
            instance.empresa = empresa
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id','culqi_id','address','address_city','country_code','email','first_name','last_name','phone_number','metadata','creation_date']
        read_only_fields = ['culqi_id','creation_date']

class CreateCardSerializer(serializers.Serializer):
    customer_id = serializers.CharField(required=True)
    token_id = serializers.CharField(required=True)
    validate = serializers.BooleanField(required=False, default=True)
    metadata = serializers.DictField(required=False, default=dict)
    authentication_3DS = serializers.DictField(required=False, default=dict)

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id','card_id','customer_id','active','creation_date','metadata']
        read_only_fields = ['id','card_id','customer_id','active','creation_date','metadata']

class CreateSubscriptionSerializer(serializers.Serializer):
    card_id = serializers.CharField(required=True)
    plan_id = serializers.CharField(required=True)
    tyc = serializers.BooleanField(required=True)
    metadata = serializers.DictField(required=False, default=dict)

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id','subscription_id','plan_id','card_id','status','creation_date','next_billing_date','metadata']

class ReclamoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reclamo
        fields = ['id', 'usuario', 'nombre', 'email', 'telefono', 'mensaje', 'fecha', 'estado', 'respuesta']
        read_only_fields = ['id', 'fecha', 'estado', 'respuesta', 'usuario']
