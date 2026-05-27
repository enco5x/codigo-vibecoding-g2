from django.contrib import admin
from .models import Driver


@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ('license_number', 'phone', 'email', 'is_available', 'created_at')
    search_fields = ('license_number', 'phone', 'email')
    list_filter = ('is_available',)
