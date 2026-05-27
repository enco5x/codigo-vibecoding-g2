from django.contrib import admin
from .models import Route, RouteStop


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ('name', 'transport', 'status', 'estimated_start', 'estimated_end', 'created_at')
    search_fields = ('name',)
    list_filter = ('status',)


@admin.register(RouteStop)
class RouteStopAdmin(admin.ModelAdmin):
    list_display = ('route', 'order', 'address', 'city', 'status')
    list_filter = ('status',)
