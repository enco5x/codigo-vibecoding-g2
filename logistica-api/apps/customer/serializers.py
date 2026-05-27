from rest_framework import serializers
from .models import Customer


class CustomerListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'company_name', 'contact_name', 'email', 'city']


class CustomerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class CustomerCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['user', 'company_name', 'contact_name', 'email', 'phone', 'address', 'city', 'country']
