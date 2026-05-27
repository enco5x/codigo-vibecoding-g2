# Spec: Shipment Module

**App:** `shipment/` (crear con `startapp`)
**Phase:** 5 (Core business)
**Architecture pattern:** models → serializers → views → urls

---

## Task 1: Create shipment app

```bash
python manage.py startapp shipment
```

---

## Task 2: Create models — `shipment/models.py`

Dos modelos en el mismo archivo: `Shipment` y `ShipmentItem`.

### Shipment

**Campos (según `docs/database-schema.md` §9 — tabla `shipment`):**

| Campo | Tipo | Constraints |
|-------|------|-------------|
| `id` | `BigAutoField` | PK |
| `tracking_number` | `CharField(max_length=50)` | `unique=True` |
| `customer` | `ForeignKey(Customer, on_delete=models.CASCADE, related_name='shipments')` | FK → customer, NOT NULL |
| `warehouse` | `ForeignKey(Warehouse, on_delete=models.SET_NULL, null=True, blank=True, related_name='shipments')` | FK → warehouse, nullable |
| `origin_address` | `TextField(blank=True)` | |
| `destination_address` | `TextField()` | NOT NULL |
| `destination_city` | `CharField(max_length=100)` | NOT NULL |
| `destination_country` | `CharField(max_length=100)` | NOT NULL |
| `status` | `CharField(max_length=20, choices=STATUS_CHOICES, default='pending')` | |
| `scheduled_pickup` | `DateTimeField(null=True, blank=True)` | |
| `actual_pickup` | `DateTimeField(null=True, blank=True)` | |
| `scheduled_delivery` | `DateTimeField(null=True, blank=True)` | |
| `actual_delivery` | `DateTimeField(null=True, blank=True)` | |
| `shipping_cost` | `DecimalField(max_digits=10, decimal_places=2, default=0.00)` | |
| `weight_kg` | `DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)` | |
| `notes` | `TextField(blank=True)` | |
| `created_at` | `DateTimeField(auto_now_add=True)` | |
| `updated_at` | `DateTimeField(auto_now=True)` | |

**STATUS_CHOICES:**
```python
STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('assigned', 'Assigned'),
    ('in_transit', 'In Transit'),
    ('delivered', 'Delivered'),
    ('cancelled', 'Cancelled'),
]
```

**Meta:**
```python
class Meta:
    db_table = 'shipment'
    ordering = ['-created_at']
    verbose_name = 'Shipment'
    verbose_name_plural = 'Shipments'
```

**`__str__`:** return `self.tracking_number`

### ShipmentItem

**Campos (según `docs/database-schema.md` §10 — tabla `shipment_item`):**

| Campo | Tipo | Constraints |
|-------|------|-------------|
| `id` | `BigAutoField` | PK |
| `shipment` | `ForeignKey(Shipment, on_delete=models.CASCADE, related_name='items')` | FK → shipment, NOT NULL |
| `product` | `ForeignKey(Product, on_delete=models.CASCADE, related_name='shipment_items')` | FK → product, NOT NULL |
| `quantity` | `IntegerField(default=1)` | |
| `unit_price` | `DecimalField(max_digits=10, decimal_places=2)` | |

**Meta:**
```python
class Meta:
    db_table = 'shipment_item'
    verbose_name = 'Shipment Item'
    verbose_name_plural = 'Shipment Items'
```

**`__str__`:** return f"{self.product.name} x{self.quantity}"

### Imports necesarios:
```python
from django.db import models
from customer.models import Customer
from warehouse.models import Warehouse
from products.models import Product
```

---

## Task 3: Create serializers — `shipment/serializers.py`

### 3a. Summary serializers (anidados para Detail)

```python
class CustomerSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'company_name', 'email', 'phone']


class WarehouseSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ['id', 'name', 'code', 'city']
```

### 3b. ShipmentItemSerializer

```python
class ShipmentItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = ShipmentItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price']
```

### 3c. ShipmentListSerializer

```python
class ShipmentListSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.company_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Shipment
        fields = [
            'id', 'tracking_number', 'customer_name',
            'status', 'status_display', 'destination_city',
            'scheduled_delivery', 'shipping_cost', 'created_at'
        ]
```

### 3d. ShipmentDetailSerializer

```python
class ShipmentDetailSerializer(serializers.ModelSerializer):
    customer = CustomerSummarySerializer(read_only=True)
    warehouse = WarehouseSummarySerializer(read_only=True)
    items = ShipmentItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Shipment
        fields = '__all__'
```

### 3e. ShipmentCreateSerializer

```python
class ShipmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = [
            'customer', 'warehouse', 'origin_address',
            'destination_address', 'destination_city', 'destination_country',
            'scheduled_pickup', 'scheduled_delivery', 'weight_kg', 'notes'
        ]
```

### 3f. ShipmentStatusUpdateSerializer

```python
class ShipmentStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = ['status']
```

---

## Task 4: Create views — `shipment/views.py`

Crear `ShipmentViewSet` extendiendo `ModelViewSet`:

```python
class ShipmentViewSet(ModelViewSet):
    queryset = Shipment.objects.all()
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'list':
            return ShipmentListSerializer
        elif self.action == 'retrieve':
            return ShipmentDetailSerializer
        elif self.action in ('create', 'update', 'partial_update'):
            return ShipmentCreateSerializer
        return ShipmentDetailSerializer
```

### Action: status update

```python
@action(detail=True, methods=['patch'], url_path='status')
def update_status(self, request, pk=None):
    shipment = self.get_object()
    serializer = ShipmentStatusUpdateSerializer(shipment, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(ShipmentDetailSerializer(shipment).data)
```

Corresponde al endpoint: `PATCH /api/v1/shipments/{id}/status/`

### Action: tracking

```python
@action(detail=False, url_path='tracking/(?P<tracking_number>[^/.]+)')
def tracking(self, request, tracking_number=None):
    shipment = get_object_or_404(Shipment, tracking_number=tracking_number)
    serializer = ShipmentDetailSerializer(shipment)
    return Response(serializer.data)
```

Corresponde al endpoint: `GET /api/v1/shipments/tracking/{tracking_number}/`

### Action: add items

```python
@action(detail=True, methods=['post'], url_path='items')
def add_item(self, request, pk=None):
    shipment = self.get_object()
    serializer = ShipmentItemSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save(shipment=shipment)
    return Response(serializer.data, status=201)
```

Corresponde al endpoint: `POST /api/v1/shipments/{id}/items/`

### Imports necesarios:
```python
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from core.permissions import IsAdminOrReadOnly
from .models import Shipment, ShipmentItem
from .serializers import (
    ShipmentListSerializer, ShipmentDetailSerializer,
    ShipmentCreateSerializer, ShipmentItemSerializer,
    ShipmentStatusUpdateSerializer
)
```

---

## Task 5: Create urls — `shipment/urls.py`

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShipmentViewSet

router = DefaultRouter()
router.register(r'', ShipmentViewSet, basename='shipment')

urlpatterns = router.urls
```

---

## Task 6: Register in admin — `shipment/admin.py`

Registrar ambos modelos:

```python
from django.contrib import admin
from .models import Shipment, ShipmentItem


@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ('tracking_number', 'customer', 'status', 'destination_city', 'shipping_cost', 'created_at')
    search_fields = ('tracking_number', 'destination_city', 'destination_country')
    list_filter = ('status', 'destination_country')
    readonly_fields = ('tracking_number', 'created_at', 'updated_at')


@admin.register(ShipmentItem)
class ShipmentItemAdmin(admin.ModelAdmin):
    list_display = ('shipment', 'product', 'quantity', 'unit_price')
    search_fields = ('shipment__tracking_number', 'product__name')
```

---

## Task 7: Add `'shipment'` to INSTALLED_APPS

En `config/settings.py`, agregar `'shipment'` después de `'transport'` (línea 51):

```python
INSTALLED_APPS = [
    ...
    'transport',
    'shipment',
]
```

---

## Task 8: Add URLs — `config/urls.py`

Agregar después de la línea de transports (línea 28):

```python
    path('api/v1/shipments/', include('shipment.urls')),
```

---

## Task 9: Create services — `shipment/services.py`

```python
class ShipmentService:
    @staticmethod
    def calculate_cost(shipment):
        # TODO: Implement cost calculation based on weight, distance, etc.
        # For now returns the current shipping_cost or 0
        return shipment.shipping_cost if shipment.shipping_cost else 0.00
```

---

## Task 10: Run makemigrations + migrate

```bash
.venv\Scripts\python.exe manage.py makemigrations
.venv\Scripts\python.exe manage.py migrate
```

Verificar que las tablas `shipment` y `shipment_item` se crean correctamente.
