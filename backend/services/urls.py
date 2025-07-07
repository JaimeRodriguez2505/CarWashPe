from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (CarroViewSet, EmpresaViewSet, CulqiPlansViewSet, CustomerViewSet, CardViewSet, get_my_customer_id, SubscriptionViewSet, ReclamoViewSet)
from rest_framework.documentation import include_docs_urls
from . import views

router = DefaultRouter()
router.register(r'carros', CarroViewSet)
router.register(r'empresas', EmpresaViewSet)
router.register(r'culqi/plans', CulqiPlansViewSet, basename='culqi-plans')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'cards', CardViewSet, basename='card')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'reclamos', ReclamoViewSet, basename='reclamo')


urlpatterns = [
    path('', include(router.urls)),
    path('customers/me/', get_my_customer_id, name='get_my_customer_id'),
    path('admin/users/', views.admin_users_list, name='admin_users_list'),
    path('admin/reclamos/', views.admin_reclamos_list, name='admin_reclamos_list'),
    path('admin/reclamos/<int:pk>/responder/', views.admin_responder_reclamo, name='admin_responder_reclamo'),
    path('docs/', include_docs_urls(title="Services API"))
]
