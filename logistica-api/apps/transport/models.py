from django.db import models


class Transport(models.Model):
    plate_number = models.CharField(max_length=20, unique=True)
    vehicle_type = models.CharField(max_length=50, blank=True)
    vehicle_model = models.CharField(max_length=100, blank=True, db_column='model')
    capacity_kg = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_available = models.BooleanField(default=True)
    driver = models.ForeignKey(
        'driver.Driver',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transports'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'transport'
        ordering = ['-created_at']
        verbose_name = 'Transport'
        verbose_name_plural = 'Transports'

    def __str__(self):
        return self.plate_number
