from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from apps.core.permissions import IsAdminOrManager
from .models import Shipment, ShipmentItem
from .serializers import (
    ShipmentListSerializer, ShipmentDetailSerializer,
    ShipmentCreateSerializer, ShipmentItemSerializer,
    ShipmentStatusUpdateSerializer
)


class ShipmentViewSet(ModelViewSet):
    queryset = Shipment.objects.all()
    permission_classes = [IsAdminOrManager]

    def get_serializer_class(self):
        if self.action == 'list':
            return ShipmentListSerializer
        elif self.action == 'retrieve':
            return ShipmentDetailSerializer
        elif self.action in ('create', 'update', 'partial_update'):
            return ShipmentCreateSerializer
        return ShipmentDetailSerializer

    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        shipment = self.get_object()
        serializer = ShipmentStatusUpdateSerializer(shipment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(ShipmentDetailSerializer(shipment).data)

    @action(detail=False, url_path='tracking/(?P<tracking_number>[^/.]+)')
    def tracking(self, request, tracking_number=None):
        shipment = get_object_or_404(Shipment, tracking_number=tracking_number)
        serializer = ShipmentDetailSerializer(shipment)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='items')
    def add_item(self, request, pk=None):
        shipment = self.get_object()
        serializer = ShipmentItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(shipment=shipment)
        return Response(serializer.data, status=201)


