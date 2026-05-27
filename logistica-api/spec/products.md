# Spec: Products Module

**App:** `products/` (esqueleto vacío, ya creado con `startapp`)
**Phase:** 3
**Architecture pattern:** models → serializers → views → urls

---

## Task 1: Update model — `products/models.py`

Sobrescribir el archivo `products/models.py` con el modelo `Product`.

**Campos (según `docs/database-schema.md` - tabla `product`):**

| Campo | Tipo | Constraints |
|-------|------|-------------|
| `id` | `BigAutoField` | PK |
| `sku` | `CharField(max_length=50)` | `unique=True` |
| `name` | `CharField(max_length=255)` | |
| `description` | `TextField(blank=True)` | |
| `category` | `CharField(max_length=100, blank=True)` | |
| `unit_price` | `DecimalField(max_digits=10, decimal_places=2)` | `default=0.00` |
| `supplier` | `ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')` | FK → supplier |
| `warehouse` | `ForeignKey(Warehouse, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')` | FK → warehouse |
| `stock_quantity` | `IntegerField(default=0)` | |
| `weight_kg` | `DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)` | |
| `dimensions` | `CharField(max_length=100, blank=True)` | |
| `is_active` | `BooleanField(default=True)` | |
| `created_at` | `DateTimeField(auto_now_add=True)` | |
| `updated_at` | `DateTimeField(auto_now=True)` | |

**Meta:**
```python
class Meta:
    db_table = 'product'
    ordering = ['-created_at']
    verbose_name = 'Product'
    verbose_name_plural = 'Products'
```

**`__str__`:** return `self.name`

**Imports necesarios:**
```python
from django.db import models
from supplier.models import Supplier
from warehouse.models import Warehouse
```

> **Nota:** Seguir el mismo patrón que `supplier/models.py` y `warehouse/models.py`.

---

## Task 2: Create serializers — `products/serializers.py`

Crear `products/serializers.py` con 3 serializers (mismo patrón que `supplier/serializers.py`):

1. **`ProductListSerializer`** — campos: `id`, `sku`, `name`, `category`, `unit_price`, `stock_quantity`, `is_active`, `supplier_name` (read_only, source=`supplier.company_name`), `warehouse_name` (read_only, source=`warehouse.name`)

2. **`ProductDetailSerializer`** — fields: `__all__` (incluye supplier y warehouse como IDs, no expandidos)

3. **`ProductCreateSerializer`** — fields: `sku`, `name`, `description`, `category`, `unit_price`, `supplier`, `warehouse`, `stock_quantity`, `weight_kg`, `dimensions`

---

## Task 3: Create views — `products/views.py`

Crear `ProductViewSet` extendiendo `ModelViewSet` (mismo patrón que `supplier/views.py`):

- `queryset = Product.objects.all()`
- `permission_classes = [IsAdminOrReadOnly]`
- `get_serializer_class()` method con la misma lógica que SupplierViewSet

**Action extra — buscar por SKU:**
```python
@action(detail=False, url_path='by-sku/(?P<sku>[^/.]+)')
def by_sku(self, request, sku=None):
    product = get_object_or_404(Product, sku=sku)
    serializer = ProductDetailSerializer(product)
    return Response(serializer.data)
```

Corresponde al endpoint: `GET /api/v1/products/by-sku/{sku}/`

**Imports necesarios:**
```python
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from core.permissions import IsAdminOrReadOnly
from .models import Product
from .serializers import ProductListSerializer, ProductDetailSerializer, ProductCreateSerializer
```

---

## Task 4: Create urls — `products/urls.py`

Crear `products/urls.py` (mismo patrón que `supplier/urls.py`):

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register(r'', ProductViewSet, basename='product')

urlpatterns = router.urls
```

---

## Task 5: Update admin — `products/admin.py`

Registrar `Product` en el admin (mismo patrón que `supplier/admin.py`):

```python
from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('sku', 'name', 'category', 'unit_price', 'stock_quantity', 'is_active', 'created_at')
    search_fields = ('sku', 'name', 'category')
    list_filter = ('category', 'is_active')
```

---

## Task 6: Add `products` to INSTALLED_APPS

Verificar que `'products'` esté en `INSTALLED_APPS` dentro de `config/settings.py`.

**Estado actual (línea 34-49):**
```python
INSTALLED_APPS = [
    ...
    'supplier',
]
```

**Agregar después de `'supplier'` (línea 48):**
```python
    'products',
```

---

## Task 7: Add URLs — `config/urls.py`

Agregar ruta de products en `config/urls.py`.

**Estado actual (línea 20-26):**
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('core.urls')),
    path('api/v1/customers/', include('customer.urls')),
    path('api/v1/warehouses/', include('warehouse.urls')),
    path('api/v1/suppliers/', include('supplier.urls')),
]
```

**Agregar después de la línea de suppliers (línea 25):**
```python
    path('api/v1/products/', include('products.urls')),
```

---

## Task 8: Run makemigrations + migrate

Ejecutar migraciones:

```bash
.venv\Scripts\python.exe manage.py makemigrations
.venv\Scripts\python.exe manage.py migrate
```

Verificar que la tabla `product` se crea correctamente.
