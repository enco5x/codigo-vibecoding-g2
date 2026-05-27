from django.db import models


class Route(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    name = models.CharField(max_length=255)
    transport = models.ForeignKey(
        'transport.Transport',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='routes'
    )
    status = models.CharField(max_length=20, default='pending', choices=STATUS_CHOICES)
    estimated_start = models.DateTimeField(null=True, blank=True)
    actual_start = models.DateTimeField(null=True, blank=True)
    estimated_end = models.DateTimeField(null=True, blank=True)
    actual_end = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'route'
        ordering = ['-created_at']
        verbose_name = 'Route'
        verbose_name_plural = 'Routes'

    def __str__(self):
        return self.name


class RouteStop(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('arrived', 'Arrived'),
        ('completed', 'Completed'),
    ]

    route = models.ForeignKey(
        'route.Route',
        on_delete=models.CASCADE,
        related_name='stops'
    )
    order = models.IntegerField()
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    estimated_arrival = models.DateTimeField(null=True, blank=True)
    actual_arrival = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, default='pending', choices=STATUS_CHOICES)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'route_stop'
        ordering = ['order']
        verbose_name = 'Route Stop'
        verbose_name_plural = 'Route Stops'

    def __str__(self):
        return f"{self.route.name} - Stop {self.order}"
