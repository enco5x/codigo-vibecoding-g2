from django.contrib import admin
from .models import Transport


@admin.register(Transport)
class TransportAdmin(admin.ModelAdmin):
    list_display = ('plate_number', 'vehicle_type', 'vehicle_model', 'capacity_kg', 'is_available', 'driver', 'created_at')
    search_fields = ('plate_number', 'vehicle_type', 'vehicle_model')
    list_filter = ('vehicle_type', 'is_available')
