from rest_framework import serializers
from .models import Driver


class DriverListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['id', 'license_number', 'phone', 'email', 'is_available']


class DriverDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'


class DriverCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['user', 'license_number', 'phone', 'email', 'is_available']
