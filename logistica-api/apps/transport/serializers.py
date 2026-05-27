from rest_framework import serializers
from .models import Transport


class TransportListSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(read_only=True, source='driver.license_number')

    class Meta:
        model = Transport
        fields = ['id', 'plate_number', 'vehicle_type', 'vehicle_model', 'driver_name', 'is_available']


class TransportDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transport
        fields = '__all__'


class TransportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transport
        fields = ['plate_number', 'vehicle_type', 'vehicle_model', 'capacity_kg', 'is_available', 'driver']
