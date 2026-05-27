from rest_framework import serializers
from .models import Product


class ProductListSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(read_only=True, source='supplier.company_name')
    warehouse_name = serializers.CharField(read_only=True, source='warehouse.name')

    class Meta:
        model = Product
        fields = ['id', 'sku', 'name', 'category', 'unit_price', 'stock_quantity', 'is_active', 'supplier_name', 'warehouse_name']


class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['sku', 'name', 'description', 'category', 'unit_price', 'supplier', 'warehouse', 'stock_quantity', 'weight_kg', 'dimensions']
