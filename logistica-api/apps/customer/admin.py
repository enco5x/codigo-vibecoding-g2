from django.contrib import admin
from .models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'contact_name', 'email', 'city', 'created_at')
    search_fields = ('company_name', 'contact_name', 'email')
    list_filter = ('city', 'country')
