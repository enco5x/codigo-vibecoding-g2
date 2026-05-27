# Architecture - logistica-api (MVP)

## Overview

Arquitectura de desarrollo para el MVP de la API de gestión logística usando Django + Django REST Framework.

---

## 1. Django Apps Structure

### App Directory

```
logistica-api/
├── config/                 # Project settings
├── core/                   # Base app (shared utilities)
├── customer/               # Customer management
├── warehouse/              # Warehouse management
├── supplier/               # Supplier management
├── products/               # Product management
├── driver/                 # Driver management
├── transport/             # Vehicle management
├── route/                  # Route & stops management
└── shipment/               # Shipments (core business)
```

### Justification

- Each app = independent business domain
- Clear separation of concerns
- Independent scalability
- Easier testing and parallel development

---

## 2. App Architecture Pattern

Each app follows:

```
app/
├── __init__.py
├── models.py           # Django models (domain entities)
├── serializers.py      # DRF Serializers (JSON transformation)
├── views.py            # Views/ViewSets (HTTP logic)
├── urls.py             # API routes
├── admin.py            # Django Admin config
├── services.py         # Business logic (optional)
├── permissions.py      # Custom permissions
├── validators.py       # Custom validators
└── apps.py            # App configuration
```

### Services Layer

For complex business logic not belonging to models or views:

```python
# Example: shipment/services.py
class ShipmentService:
    @staticmethod
    def calculate_cost(shipment):
        # Calculate shipping cost based on weight, distance, etc.
        pass
    
    @staticmethod
    def assign_route(shipment, route):
        # Assign route to shipment
        pass
```

---

## 3. REST API Endpoints

**Base URL:** `/api/v1/`

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login/` | Get JWT tokens |
| POST | `/api/v1/auth/refresh/` | Refresh token |
| POST | `/api/v1/auth/logout/` | Invalidate token |

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/customers/` | List customers |
| POST | `/api/v1/customers/` | Create customer |
| GET | `/api/v1/customers/{id}/` | Get customer |
| PUT | `/api/v1/customers/{id}/` | Update customer |
| DELETE | `/api/v1/customers/{id}/` | Delete customer |

### Warehouses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/warehouses/` | List warehouses |
| POST | `/api/v1/warehouses/` | Create warehouse |
| GET | `/api/v1/warehouses/{id}/` | Get warehouse |
| PUT | `/api/v1/warehouses/{id}/` | Update warehouse |
| DELETE | `/api/v1/warehouses/{id}/` | Delete warehouse |

### Suppliers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/suppliers/` | List suppliers |
| POST | `/api/v1/suppliers/` | Create supplier |
| GET | `/api/v1/suppliers/{id}/` | Get supplier |
| PUT | `/api/v1/suppliers/{id}/` | Update supplier |
| DELETE | `/api/v1/suppliers/{id}/` | Delete supplier |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/products/` | List products |
| POST | `/api/v1/products/` | Create product |
| GET | `/api/v1/products/{id}/` | Get product |
| GET | `/api/v1/products/by-sku/{sku}/` | Get by SKU |
| PUT | `/api/v1/products/{id}/` | Update product |
| DELETE | `/api/v1/products/{id}/` | Delete product |

### Drivers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/drivers/` | List drivers |
| POST | `/api/v1/drivers/` | Create driver |
| GET | `/api/v1/drivers/{id}/` | Get driver |
| PUT | `/api/v1/drivers/{id}/` | Update driver |
| DELETE | `/api/v1/drivers/{id}/` | Delete driver |

### Transports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/transports/` | List transports |
| POST | `/api/v1/transports/` | Create transport |
| GET | `/api/v1/transports/{id}/` | Get transport |
| PUT | `/api/v1/transports/{id}/` | Update transport |
| DELETE | `/api/v1/transports/{id}/` | Delete transport |

### Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/routes/` | List routes |
| POST | `/api/v1/routes/` | Create route |
| GET | `/api/v1/routes/{id}/` | Get route |
| PUT | `/api/v1/routes/{id}/` | Update route |
| GET | `/api/v1/routes/{id}/stops/` | Get route stops |
| POST | `/api/v1/routes/{id}/stops/` | Add stop to route |
| PUT | `/api/v1/routes/{id}/stops/{stop_id}/` | Update stop |

### Shipments (Core)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/shipments/` | List shipments |
| POST | `/api/v1/shipments/` | Create shipment |
| GET | `/api/v1/shipments/{id}/` | Get shipment |
| GET | `/api/v1/shipments/tracking/{tracking_number}/` | Track shipment |
| PUT | `/api/v1/shipments/{id}/` | Update shipment |
| PATCH | `/api/v1/shipments/{id}/status/` | Update status |
| POST | `/api/v1/shipments/{id}/items/` | Add items to shipment |
| DELETE | `/api/v1/shipments/{id}/` | Delete shipment |

---

## 4. Authentication & Authorization

### JWT Authentication

Using `djangorestframework-simplejwt`:

```python
# Token endpoints
POST /api/v1/auth/login/    # Returns access + refresh tokens
POST /api/v1/auth/refresh/  # Refresh access token
```

### Role-Based Permissions

Using Django Groups:

| Role | Permissions |
|------|-------------|
| `admin` | Full CRUD on all modules |
| `manager` | CRUD on shipments, routes, transports |
| `driver` | View assigned routes, update delivery status |
| `customer` | View own shipments only |

### Permission Implementation

```python
# Example: shipment/permissions.py
class IsAdminOrManager(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.groups.filter(name__in=['admin', 'manager']).exists()

class IsShipmentOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.groups.filter(name='admin').exists():
            return True
        return obj.customer.user == request.user
```

---

## 5. Models - Best Practices

```python
# Example: customer/models.py
class Customer(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    
    user = models.OneToOneField(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='customer_profile'
    )
    company_name = models.CharField(max_length=255)
    contact_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(max_length=254, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'customer'
        ordering = ['-created_at']
        verbose_name = 'Customer'
        verbose_name_plural = 'Customers'
    
    def __str__(self):
        return self.company_name
```

### Conventions

- Use explicit `db_table` to match schema
- Add `created_at`, `updated_at` timestamps to all models
- Use `is_active` for soft deletes
- Use `STATUS_CHOICES` for status fields
- Use `related_name` for reverse FK relationships
- Add `__str__` method for debugging

---

## 6. Serializers Structure

```python
# shipment/serializers.py
from rest_framework import serializers
from .models import Shipment, ShipmentItem

class ShipmentItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = ShipmentItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price']

class ShipmentListSerializer(serializers.ModelSerializer):
    """List view - minimal data"""
    customer_name = serializers.CharField(source='customer.company_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Shipment
        fields = [
            'id', 'tracking_number', 'customer_name',
            'status', 'status_display', 'scheduled_delivery', 'shipping_cost'
        ]

class ShipmentDetailSerializer(serializers.ModelSerializer):
    """Detail view - full data with relations"""
    customer = CustomerSummarySerializer(read_only=True)
    warehouse = WarehouseSummarySerializer(read_only=True)
    items = ShipmentItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Shipment
        fields = '__all__'

class ShipmentCreateSerializer(serializers.ModelSerializer):
    """Create/Update - accepts IDs"""
    class Meta:
        model = Shipment
        fields = [
            'customer', 'warehouse', 'origin_address',
            'destination_address', 'destination_city', 'destination_country',
            'scheduled_pickup', 'scheduled_delivery', 'weight_kg', 'notes'
        ]
```

---

## 7. Development Phases

| Phase | Modules | Functionality |
|-------|---------|---------------|
| **Phase 1** | Core + Auth | Django setup, DRF, JWT authentication, user groups |
| **Phase 2** | Customer, Warehouse, Supplier | Basic CRUD for entities |
| **Phase 3** | Products | Inventory, stock management |
| **Phase 4** | Driver, Transport | Vehicle fleet management |
| **Phase 5** | Shipment (Core) | Create shipments, tracking, status updates |
| **Phase 6** | Route | Routes and stops management |
| **Phase 7** | Testing + Docs | Unit tests, API documentation |

---

## 8. Dependencies

```python
# requirements.txt
Django>=6.0
djangorestframework>=3.15
djangorestframework-simplejwt>=5.3
django-cors-headers>=4.3
drf-spectacular>=0.27
pytest>=8.0
pytest-django>=4.7
```

---

## 9. Extras

- **API Documentation**: Swagger/OpenAPI at `/api/docs/` using `drf-spectacular`
- **Logging**: Configure for debug and error tracking
- **Testing**: Minimum 70% coverage on models and views
- **API Versioning**: Use `/api/v1/` from the start

---

## 10. File Organization Summary

```
logistica-api/
├── config/
│   ├── settings.py      # Django settings
│   ├── urls.py          # Root URL config
│   └── ...
├── core/                # Shared utilities
├── customer/            # Customer app
├── warehouse/           # Warehouse app
├── supplier/            # Supplier app
├── products/            # Products app
├── driver/              # Driver app
├── transport/           # Transport app
├── route/               # Route app
├── shipment/            # Shipment app (core)
├── docs/
│   ├── database-schema.md
│   └── architecture.md
├── db.sqlite3
├── manage.py
└── requirements.txt
```

---

## 11. Testing Agent

Testing is handled by an independent agent outside the SDD flow:

- **Agent file**: `.opencode/agents/testing.md`
- **Scope**: Unit tests per Django app (`tests.py`), no production code changes
- **Coverage**: Minimum 80% per module, HTML report in `coverage_html/`
- **Scenarios**: Happy path, unhappy path (400/404/401), edge cases per endpoint
- **Invocation**: Manual, via Orquestador or direct agent call



