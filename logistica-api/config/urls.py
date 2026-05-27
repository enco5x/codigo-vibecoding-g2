"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.shortcuts import redirect
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


def api_root(request):
    return JsonResponse({
        'message': 'Logistica API',
        'version': '1.0.0',
        'docs': '/api/docs/',
        'admin': '/admin/',
        'auth': '/api/v1/auth/',
        'customers': '/api/v1/customers/',
        'warehouses': '/api/v1/warehouses/',
        'suppliers': '/api/v1/suppliers/',
        'products': '/api/v1/products/',
        'drivers': '/api/v1/drivers/',
        'transports': '/api/v1/transports/',
        'shipments': '/api/v1/shipments/',
        'routes': '/api/v1/routes/',
    })


urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/auth/', include('apps.core.urls')),
    path('api/v1/customers/', include('apps.customer.urls')),
    path('api/v1/warehouses/', include('apps.warehouse.urls')),
    path('api/v1/suppliers/', include('apps.supplier.urls')),
    path('api/v1/products/', include('apps.products.urls')),
    path('api/v1/drivers/', include('apps.driver.urls')),
    path('api/v1/transports/', include('apps.transport.urls')),
    path('api/v1/shipments/', include('apps.shipment.urls')),
    path('api/v1/routes/', include('apps.route.urls')),
]


