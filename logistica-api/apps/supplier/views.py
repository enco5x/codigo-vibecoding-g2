from rest_framework.viewsets import ModelViewSet
from apps.core.permissions import IsAdminOrReadOnly
from .models import Supplier
from .serializers import SupplierListSerializer, SupplierDetailSerializer, SupplierCreateSerializer


class SupplierViewSet(ModelViewSet):
    queryset = Supplier.objects.all()
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'list':
            return SupplierListSerializer
        elif self.action == 'retrieve':
            return SupplierDetailSerializer
        elif self.action in ('create', 'update', 'partial_update'):
            return SupplierCreateSerializer
        return SupplierDetailSerializer


