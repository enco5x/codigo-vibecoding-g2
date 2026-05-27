from django.contrib import admin
from .models import Shipment, ShipmentItem


@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ('tracking_number', 'customer', 'status', 'destination_city', 'shipping_cost', 'created_at')
    search_fields = ('tracking_number', 'destination_city', 'destination_country')
    list_filter = ('status', 'destination_country')
    readonly_fields = ('tracking_number', 'created_at', 'updated_at')


@admin.register(ShipmentItem)
class ShipmentItemAdmin(admin.ModelAdmin):
    list_display = ('shipment', 'product', 'quantity', 'unit_price')
    search_fields = ('shipment__tracking_number', 'product__name')
