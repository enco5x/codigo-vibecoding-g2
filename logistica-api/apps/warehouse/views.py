from rest_framework.viewsets import ModelViewSet
from apps.core.permissions import IsAdminOrManager
from .models import Warehouse
from .serializers import WarehouseListSerializer, WarehouseDetailSerializer, WarehouseCreateSerializer

class WarehouseViewSet(ModelViewSet):
    queryset = Warehouse.objects.all()
    permission_classes = [IsAdminOrManager]

    def get_serializer_class(self):
        if self.action == 'list':
            return WarehouseListSerializer
        elif self.action == 'retrieve':
            return WarehouseDetailSerializer
        elif self.action in ('create', 'update', 'partial_update'):
            return WarehouseCreateSerializer
        return WarehouseDetailSerializer


