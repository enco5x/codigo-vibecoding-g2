from rest_framework import serializers
from .models import Route, RouteStop


class RouteStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteStop
        fields = '__all__'
        read_only_fields = ['route']


class RouteListSerializer(serializers.ModelSerializer):
    transport_plate = serializers.SerializerMethodField()

    class Meta:
        model = Route
        fields = ['id', 'name', 'transport_id', 'transport_plate', 'status', 'estimated_start', 'estimated_end', 'created_at']

    def get_transport_plate(self, obj):
        if obj.transport:
            return obj.transport.plate_number
        return None


class RouteDetailSerializer(serializers.ModelSerializer):
    stops = RouteStopSerializer(many=True, read_only=True)

    class Meta:
        model = Route
        fields = '__all__'


class RouteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ['name', 'transport', 'estimated_start', 'estimated_end']
