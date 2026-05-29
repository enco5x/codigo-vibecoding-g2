from rest_framework.viewsets import ModelViewSet
from apps.core.permissions import IsAdminOrManager
from .models import Transport
from .serializers import TransportListSerializer, TransportDetailSerializer, TransportCreateSerializer


class TransportViewSet(ModelViewSet):
    queryset = Transport.objects.all()
    permission_classes = [IsAdminOrManager]

    def get_serializer_class(self):
        if self.action == 'list':
            return TransportListSerializer
        elif self.action == 'retrieve':
            return TransportDetailSerializer
        elif self.action in ('create', 'update', 'partial_update'):
            return TransportCreateSerializer
        return TransportDetailSerializer


