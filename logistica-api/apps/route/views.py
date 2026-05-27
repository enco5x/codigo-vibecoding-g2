from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from apps.core.permissions import IsAdminOrReadOnly
from .models import Route, RouteStop
from .serializers import (
    RouteListSerializer, RouteDetailSerializer,
    RouteCreateSerializer, RouteStopSerializer
)


class RouteViewSet(ModelViewSet):
    queryset = Route.objects.all()
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'list':
            return RouteListSerializer
        elif self.action == 'retrieve':
            return RouteDetailSerializer
        elif self.action in ('create', 'update', 'partial_update'):
            return RouteCreateSerializer
        return RouteDetailSerializer

    @action(detail=True, methods=['get', 'post'], url_path='stops')
    def manage_stops(self, request, pk=None):
        route = self.get_object()
        if request.method == 'GET':
            stops = route.stops.all()
            serializer = RouteStopSerializer(stops, many=True)
            return Response(serializer.data)
        else:  # POST
            serializer = RouteStopSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(route=route)
            return Response(serializer.data, status=201)

    @action(detail=True, methods=['put'], url_path='stops/(?P<stop_id>[^/.]+)')
    def update_stop(self, request, pk=None, stop_id=None):
        route = self.get_object()
        stop = get_object_or_404(RouteStop, id=stop_id, route=route)
        serializer = RouteStopSerializer(stop, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


