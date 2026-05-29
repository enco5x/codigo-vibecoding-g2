from rest_framework.viewsets import ModelViewSet
from apps.core.permissions import IsAdminOrManager
from .models import Customer
from .serializers import CustomerListSerializer, CustomerDetailSerializer, CustomerCreateSerializer


class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.all()
    permission_classes = [IsAdminOrManager]

    def get_serializer_class(self):
        if self.action == 'list':
            return CustomerListSerializer
        elif self.action == 'retrieve':
            return CustomerDetailSerializer
        elif self.action in ('create', 'update', 'partial_update'):
            return CustomerCreateSerializer
        return CustomerDetailSerializer


