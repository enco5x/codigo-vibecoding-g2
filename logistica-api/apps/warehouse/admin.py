from django.contrib import admin
from .models import Warehouse


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'city', 'capacity', 'is_active', 'created_at')
    search_fields = ('name', 'code', 'city')
    list_filter = ('is_active', 'city', 'country')
