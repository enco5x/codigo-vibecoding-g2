from rest_framework import serializers
from .models import PaymentOrder


class CartItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class CheckoutSessionSerializer(serializers.Serializer):
    items = CartItemSerializer(many=True)
    success_url = serializers.URLField()
    cancel_url = serializers.URLField()


class PaymentOrderSerializer(serializers.ModelSerializer):
    shipment_tracking = serializers.CharField(source='shipment.tracking_number', read_only=True, default=None)

    class Meta:
        model = PaymentOrder
        fields = [
            'id', 'shipment', 'shipment_tracking', 'stripe_session_id',
            'stripe_payment_intent_id', 'stripe_customer_email',
            'amount_total', 'currency', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['stripe_session_id', 'stripe_payment_intent_id', 'stripe_customer_email']
