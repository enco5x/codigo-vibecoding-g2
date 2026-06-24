from django.db import models
from apps.shipment.models import Shipment


PAYMENT_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('completed', 'Completed'),
    ('failed', 'Failed'),
    ('cancelled', 'Cancelled'),
    ('refunded', 'Refunded'),
]


class PaymentOrder(models.Model):
    shipment = models.ForeignKey(
        Shipment, on_delete=models.SET_NULL, null=True, blank=True, related_name='payment_orders'
    )
    stripe_session_id = models.CharField(max_length=255, unique=True)
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True)
    stripe_customer_email = models.EmailField(blank=True)
    amount_total = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='usd')
    status = models.CharField(
        max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payment_order'
        ordering = ['-created_at']
        verbose_name = 'Payment Order'
        verbose_name_plural = 'Payment Orders'

    def __str__(self):
        return f"Payment {self.stripe_session_id[:20]}... - {self.status}"
