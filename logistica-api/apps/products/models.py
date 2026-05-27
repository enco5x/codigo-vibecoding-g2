from django.db import models
from apps.supplier.models import Supplier
from apps.warehouse.models import Warehouse


class Product(models.Model):
    sku = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    supplier = models.ForeignKey(
        Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name='products'
    )
    warehouse = models.ForeignKey(
        Warehouse, on_delete=models.SET_NULL, null=True, blank=True, related_name='products'
    )
    stock_quantity = models.IntegerField(default=0)
    weight_kg = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    dimensions = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'product'
        ordering = ['-created_at']
        verbose_name = 'Product'
        verbose_name_plural = 'Products'

    def __str__(self):
        return self.name



