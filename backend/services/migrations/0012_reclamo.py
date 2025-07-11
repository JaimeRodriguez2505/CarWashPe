# Generated by Django 4.2.16 on 2025-07-02 20:28

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('services', '0011_carro_foto'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reclamo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('telefono', models.CharField(blank=True, max_length=20)),
                ('mensaje', models.TextField()),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('estado', models.CharField(choices=[('pendiente', 'Pendiente'), ('atendido', 'Atendido'), ('cerrado', 'Cerrado')], default='pendiente', max_length=20)),
                ('respuesta', models.TextField(blank=True, null=True)),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reclamos', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
