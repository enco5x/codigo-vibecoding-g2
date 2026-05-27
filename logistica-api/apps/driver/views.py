from rest_framework.viewsets import ModelViewSet
from apps.core.permissions import IsAdminOrReadOnly
from .models import Driver
from .serializers import DriverListSerializer, DriverDetailSerializer, DriverCreateSerializer


class DriverViewSet(ModelViewSet):
    queryset = Driver.objects.all()
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'list':
            return DriverListSerializer
        elif self.action == 'retrieve':
            return DriverDetailSerializer
        elif self.action in ('create', 'update', 'partial_update'):
            return DriverCreateSerializer
        return DriverDetailSerializer


