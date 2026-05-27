from rest_framework import serializers
from .models import Warehouse


class WarehouseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ['id', 'name', 'code', 'city', 'is_active']


class WarehouseDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'


class WarehouseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ['name', 'code', 'address', 'city', 'country', 'capacity', 'is_active']
