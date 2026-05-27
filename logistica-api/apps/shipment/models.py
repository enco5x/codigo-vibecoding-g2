from django.db import models
from apps.customer.models import Customer
from apps.warehouse.models import Warehouse
from apps.products.models import Product


STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('assigned', 'Assigned'),
    ('in_transit', 'In Transit'),
    ('delivered', 'Delivered'),
    ('cancelled', 'Cancelled'),
]


class Shipment(models.Model):
    tracking_number = models.CharField(max_length=50, unique=True)
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, related_name='shipments'
    )
    warehouse = models.ForeignKey(
        Warehouse, on_delete=models.SET_NULL, null=True, blank=True, related_name='shipments'
    )
    origin_address = models.TextField(blank=True)
    destination_address = models.TextField()
    destination_city = models.CharField(max_length=100)
    destination_country = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    scheduled_pickup = models.DateTimeField(null=True, blank=True)
    actual_pickup = models.DateTimeField(null=True, blank=True)
    scheduled_delivery = models.DateTimeField(null=True, blank=True)
    actual_delivery = models.DateTimeField(null=True, blank=True)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    weight_kg = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shipment'
        ordering = ['-created_at']
        verbose_name = 'Shipment'
        verbose_name_plural = 'Shipments'

    def __str__(self):
        return self.tracking_number


class ShipmentItem(models.Model):
    shipment = models.ForeignKey(
        Shipment, on_delete=models.CASCADE, related_name='items'
    )
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='shipment_items'
    )
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'shipment_item'
        verbose_name = 'Shipment Item'
        verbose_name_plural = 'Shipment Items'

    def __str__(self):
        return f"{self.product.name} x{self.quantity}"




