from rest_framework import serializers
from .models import Supplier


class SupplierListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'company_name', 'contact_name', 'email', 'city']


class SupplierDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'


class SupplierCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['company_name', 'contact_name', 'email', 'phone', 'address', 'city', 'country']
