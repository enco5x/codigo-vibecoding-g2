from django.db import models
from django.conf import settings


class Driver(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='driver_profile'
    )
    license_number = models.CharField(max_length=50)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(max_length=254, blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'driver'
        ordering = ['-created_at']
        verbose_name = 'Driver'
        verbose_name_plural = 'Drivers'

    def __str__(self):
        return self.license_number
