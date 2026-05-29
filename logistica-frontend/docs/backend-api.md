# Backend API Reference

## General

| Item | Value |
|------|-------|
| Base URL | `http://localhost:8000/api/v1` |
| Auth | JWT Bearer token |
| Format | JSON |
| Pagination | PageNumberPagination, 20/page |
| Docs UI | `/api/docs/` (Swagger) |
| Schema | `/api/schema/` (OpenAPI) |

## Auth Flow

```
POST /api/v1/auth/login/   { username, password } → { access, refresh }
POST /api/v1/auth/refresh/ { refresh }            → { access }
POST /api/v1/auth/logout/  (auth)                 → 200
```

- **Access token**: 1h expiry
- **Refresh token**: 1d expiry
- **Header**: `Authorization: Bearer <access>`

## Roles & Permissions

| Role | Access |
|------|--------|
| `admin` | Full CRUD all modules |
| `manager` | Full CRUD all modules |
| `driver` | Read only |
| `customer` | Read only |

Default policy on all endpoints: `IsAdminOrReadOnly` (authenticated users can read, only admin/manager can write).

## Endpoints

### Customers — `/api/v1/customers/`

| Method | URL | Desc | Request Body |
|--------|-----|------|-------------|
| GET | `/customers/` | List (paginated) | — |
| POST | `/customers/` | Create | `{ user?, company_name, contact_name, email, phone, address, city, country }` |
| GET | `/customers/{id}/` | Detail | — |
| PUT | `/customers/{id}/` | Update full | — |
| PATCH | `/customers/{id}/` | Update partial | — |
| DELETE | `/customers/{id}/` | Delete | — |

**List response shape:**
```json
{
  "id": 1,
  "company_name": "...",
  "contact_name": "...",
  "email": "...",
  "city": "..."
}
```

**Detail** returns all fields including `created_at`, `updated_at`.

### Warehouses — `/api/v1/warehouses/`

| Method | URL | Desc | Request Body |
|--------|-----|------|-------------|
| GET | `/warehouses/` | List | — |
| POST | `/warehouses/` | Create | `{ name, code, address?, city?, country?, capacity?, is_active? }` |
| GET | `/warehouses/{id}/` | Detail | — |
| PUT | `/warehouses/{id}/` | Update | — |
| PATCH | `/warehouses/{id}/` | Partial | — |
| DELETE | `/warehouses/{id}/` | Delete | — |

**List response shape:**
```json
{
  "id": 1,
  "name": "...",
  "code": "WH-001",
  "city": "...",
  "is_active": true
}
```

### Suppliers — `/api/v1/suppliers/`

| Method | URL | Desc | Request Body |
|--------|-----|------|-------------|
| GET | `/suppliers/` | List | — |
| POST | `/suppliers/` | Create | `{ company_name, contact_name?, email?, phone?, address?, city?, country? }` |
| GET | `/suppliers/{id}/` | Detail | — |
| PUT | `/suppliers/{id}/` | Update | — |
| PATCH | `/suppliers/{id}/` | Partial | — |
| DELETE | `/suppliers/{id}/` | Delete | — |

**List response shape:**
```json
{
  "id": 1,
  "company_name": "...",
  "contact_name": "...",
  "email": "...",
  "city": "..."
}
```

### Products — `/api/v1/products/`

| Method | URL | Desc | Request Body |
|--------|-----|------|-------------|
| GET | `/products/` | List | — |
| POST | `/products/` | Create | `{ sku, name, description?, category?, unit_price, supplier?, warehouse?, stock_quantity?, weight_kg?, dimensions? }` |
| GET | `/products/{id}/` | Detail | — |
| GET | `/products/by-sku/{sku}/` | Lookup by SKU | — |
| PUT | `/products/{id}/` | Update | — |
| PATCH | `/products/{id}/` | Partial | — |
| DELETE | `/products/{id}/` | Delete | — |

**List response shape:**
```json
{
  "id": 1,
  "sku": "PROD-001",
  "name": "...",
  "category": "...",
  "unit_price": "10.00",
  "stock_quantity": 100,
  "is_active": true,
  "supplier_name": "...",
  "warehouse_name": "..."
}
```

### Drivers — `/api/v1/drivers/`

| Method | URL | Desc | Request Body |
|--------|-----|------|-------------|
| GET | `/drivers/` | List | — |
| POST | `/drivers/` | Create | `{ user?, license_number, phone?, email?, is_available? }` |
| GET | `/drivers/{id}/` | Detail | — |
| PUT | `/drivers/{id}/` | Update | — |
| PATCH | `/drivers/{id}/` | Partial | — |
| DELETE | `/drivers/{id}/` | Delete | — |

**List response shape:**
```json
{
  "id": 1,
  "license_number": "ABC-123",
  "phone": "...",
  "email": "...",
  "is_available": true
}
```

### Transports — `/api/v1/transports/`

| Method | URL | Desc | Request Body |
|--------|-----|------|-------------|
| GET | `/transports/` | List | — |
| POST | `/transports/` | Create | `{ plate_number, vehicle_type?, vehicle_model?, capacity_kg?, is_available?, driver? }` |
| GET | `/transports/{id}/` | Detail | — |
| PUT | `/transports/{id}/` | Update | — |
| PATCH | `/transports/{id}/` | Partial | — |
| DELETE | `/transports/{id}/` | Delete | — |

**List response shape:**
```json
{
  "id": 1,
  "plate_number": "ABC-1234",
  "vehicle_type": "...",
  "vehicle_model": "...",
  "driver_name": "...",
  "is_available": true
}
```

### Shipments (Core) — `/api/v1/shipments/`

| Method | URL | Desc | Request Body |
|--------|-----|------|-------------|
| GET | `/shipments/` | List | — |
| POST | `/shipments/` | Create | `{ customer, warehouse?, origin_address?, destination_address, destination_city, destination_country, scheduled_pickup?, scheduled_delivery?, weight_kg?, notes? }` |
| GET | `/shipments/{id}/` | Detail | — |
| GET | `/shipments/tracking/{tracking_number}/` | Track | — |
| PUT | `/shipments/{id}/` | Update | — |
| PATCH | `/shipments/{id}/` | Partial | — |
| PATCH | `/shipments/{id}/status/` | Update status | `{ status }` |
| POST | `/shipments/{id}/items/` | Add item | `{ product, quantity, unit_price }` |
| DELETE | `/shipments/{id}/` | Delete | — |

**List response shape:**
```json
{
  "id": 1,
  "tracking_number": "SHP-001",
  "customer_name": "...",
  "status": "pending",
  "status_display": "Pendiente",
  "destination_city": "...",
  "scheduled_delivery": "2026-06-01T00:00:00Z",
  "shipping_cost": "150.00",
  "created_at": "2026-05-27T..."
}
```

**Detail** includes nested `customer`, `warehouse`, and `items` array.

**Status choices:** `pending`, `assigned`, `in_transit`, `delivered`, `cancelled`

### Routes — `/api/v1/routes/`

| Method | URL | Desc | Request Body |
|--------|-----|------|-------------|
| GET | `/routes/` | List | — |
| POST | `/routes/` | Create | `{ name, transport?, estimated_start?, estimated_end? }` |
| GET | `/routes/{id}/` | Detail (with stops) | — |
| PUT | `/routes/{id}/` | Update | — |
| PATCH | `/routes/{id}/` | Partial | — |
| DELETE | `/routes/{id}/` | Delete | — |
| GET | `/routes/{id}/stops/` | List stops | — |
| POST | `/routes/{id}/stops/` | Add stop | `{ order, address?, city?, estimated_arrival?, notes? }` |
| PUT | `/routes/{id}/stops/{stop_id}/` | Update stop | — |

**List response shape:**
```json
{
  "id": 1,
  "name": "...",
  "transport_id": 1,
  "transport_plate": "ABC-1234",
  "status": "pending",
  "estimated_start": "...",
  "estimated_end": "...",
  "created_at": "..."
}
```

**Detail** includes nested `stops` array.

**Route status choices:** `pending`, `in_progress`, `completed`

**Stop status choices:** `pending`, `arrived`, `completed`

## Error Responses

```json
// Validation error (400)
{ "field_name": ["This field is required."] }

// Auth error (401)
{ "detail": "Authentication credentials were not provided." }

// Permission error (403)
{ "detail": "You do not have permission to perform this action." }

// Not found (404)
{ "detail": "Not found." }
```
