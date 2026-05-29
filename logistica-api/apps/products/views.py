from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from apps.core.permissions import IsAdminOrManager
from .models import Product
from .serializers import ProductListSerializer, ProductDetailSerializer, ProductCreateSerializer


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    permission_classes = [IsAdminOrManager]

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        elif self.action == 'retrieve':
            return ProductDetailSerializer
        elif self.action in ('create', 'update', 'partial_update'):
            return ProductCreateSerializer
        return ProductDetailSerializer

    @action(detail=False, url_path='by-sku/(?P<sku>[^/.]+)')
    def by_sku(self, request, sku=None):
        product = get_object_or_404(Product, sku=sku)
        serializer = ProductDetailSerializer(product)
        return Response(serializer.data)


