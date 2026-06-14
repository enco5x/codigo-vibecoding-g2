import uuid
from rest_framework import serializers
from apps.customer.models import Customer
from apps.warehouse.models import Warehouse
from .models import Shipment, ShipmentItem


class CustomerSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'company_name', 'email', 'phone']


class WarehouseSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ['id', 'name', 'code', 'city']


class ShipmentItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = ShipmentItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price']


class ShipmentListSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.company_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Shipment
        fields = [
            'id', 'tracking_number', 'customer_name',
            'status', 'status_display', 'destination_city',
            'scheduled_delivery', 'shipping_cost', 'created_at'
        ]


class ShipmentDetailSerializer(serializers.ModelSerializer):
    customer = CustomerSummarySerializer(read_only=True)
    warehouse = WarehouseSummarySerializer(read_only=True)
    items = ShipmentItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Shipment
        fields = '__all__'


class ShipmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = [
            'customer', 'warehouse', 'origin_address',
            'destination_address', 'destination_city', 'destination_country',
            'scheduled_pickup', 'scheduled_delivery', 'weight_kg', 'notes'
        ]

    def create(self, validated_data):
        validated_data['tracking_number'] = f"TN-{uuid.uuid4().hex[:8].upper()}"
        return super().create(validated_data)


class ShipmentStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = ['status']



