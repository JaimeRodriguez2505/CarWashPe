from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.utils import timezone
from django.conf import settings

class Empresa(models.Model):
    nombre = models.CharField(max_length=100, verbose_name="Nombre de la Empresa")
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='empresa')
    ruc = models.CharField(max_length=15, blank=True, null=True, verbose_name="RUC")  # Nuevo campo opcional
    direccion = models.CharField(max_length=255, blank=True, null=True, verbose_name="Dirección")  # Nuevo campo para dirección

    def __str__(self):
        return self.nombre

class Carro(models.Model):
    ESTADO_CHOICES = [
        ('espera', 'En Espera'),
        ('proceso', 'En Proceso'),
        ('terminado', 'Terminado'),
    ]

    placa = models.CharField(max_length=10, validators=[RegexValidator(r'^[A-Z0-9-]+$','Ingrese una placa válida.')])
    marca = models.CharField(max_length=50)
    color = models.CharField(max_length=30, blank=True, null=True)
    modelo = models.CharField(max_length=30, blank=True, null=True)
    foto = models.ImageField(upload_to='carros/', blank=True, null=True, verbose_name="Foto del carro")
    dia_llegada = models.DateTimeField(default=timezone.now)
    dia_salida = models.DateTimeField(null=True, blank=True)
    numero_telefono = models.CharField(max_length=15, validators=[RegexValidator(r'^\+?1?\d{9,15}$','Número de teléfono no válido.')])
    precio = models.DecimalField(max_digits=8, decimal_places=2)
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='espera')
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='carros')

    def __str__(self):
        return f"{self.marca} ({self.placa})"

class Plan(models.Model):
    culqi_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)
    interval_unit_time = models.CharField(max_length=50)
    interval_count = models.IntegerField()
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.name

class Customer(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    culqi_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    address = models.CharField(max_length=100, blank=True, null=True)
    address_city = models.CharField(max_length=50, blank=True, null=True)
    country_code = models.CharField(max_length=2, blank=True, null=True)
    email = models.EmailField(max_length=50, blank=True, null=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    metadata = models.JSONField(blank=True, null=True)
    creation_date = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.culqi_id}"

class Card(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    card_id = models.CharField(max_length=50, unique=True)
    customer_id = models.CharField(max_length=50)
    active = models.BooleanField(default=True)
    creation_date = models.DateTimeField(blank=True, null=True)
    metadata = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"Card {self.card_id} - User {self.user}"


class Subscription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    subscription_id = models.CharField(max_length=50, unique=True)
    plan_id = models.CharField(max_length=50)
    card_id = models.CharField(max_length=50)
    status = models.IntegerField()  # según culqi (1=activo,2=inactivo,3=otro)
    creation_date = models.DateTimeField(blank=True, null=True)
    next_billing_date = models.DateTimeField(blank=True, null=True)
    metadata = models.JSONField(blank=True, null=True, default=dict)

    def __str__(self):
        return f"Subscription {self.subscription_id} - User {self.user}"

class Reclamo(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('atendido', 'Atendido'),
        ('cerrado', 'Cerrado'),
    ]
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reclamos')
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    telefono = models.CharField(max_length=20, blank=True)
    mensaje = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    respuesta = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Reclamo de {self.nombre} - {self.fecha.strftime('%Y-%m-%d')}"
