# Backend Data Models

## Entity Relationship Overview

```
Customer ───┐
             ├── Shipment ──── ShipmentItem ──── Product
Warehouse ───┘         │
                       ├── Route ──── RouteStop
                       │
Supplier ────────── Product
                        │
Driver ──────────── Transport ──── Route
```

## Models

### Customer

| Field | Type | Notes |
|-------|------|-------|
| `id` | BigInt (PK) | Auto |
| `user` | FK → User | Optional, SET_NULL on delete |
| `company_name` | string(255) | **Required** |
| `contact_name` | string(255) | |
| `email` | email(254) | |
| `phone` | string(20) | |
| `address` | text | |
| `city` | string(100) | |
| `country` | string(100) | |
| `created_at` | datetime | Auto |
| `updated_at` | datetime | Auto |

**Relations:** `shipments` (reverse FK)

---

### Warehouse

| Field | Type | Notes |
|-------|------|-------|
| `id` | BigInt (PK) | Auto |
| `name` | string(255) | **Required** |
| `code` | string(50) | **Unique, Required** |
| `address` | text | |
| `city` | string(100) | |
| `country` | string(100) | |
| `capacity` | integer | Nullable |
| `is_active` | boolean | Default: true |
| `created_at` | datetime | Auto |
| `updated_at` | datetime | Auto |

**Relations:** `products` (reverse FK), `shipments` (reverse FK)

---

### Supplier

| Field | Type | Notes |
|-------|------|-------|
| `id` | BigInt (PK) | Auto |
| `company_name` | string(255) | **Required** |
| `contact_name` | string(255) | |
| `email` | email(254) | |
| `phone` | string(20) | |
| `address` | text | |
| `city` | string(100) | |
| `country` | string(100) | |
| `created_at` | datetime | Auto |
| `updated_at` | datetime | Auto |

**Relations:** `products` (reverse FK)

---

### Product

| Field | Type | Notes |
|-------|------|-------|
| `id` | BigInt (PK) | Auto |
| `sku` | string(50) | **Unique, Required** |
| `name` | string(255) | **Required** |
| `description` | text | |
| `category` | string(100) | |
| `unit_price` | decimal(10,2) | Default: 0 |
| `supplier` | FK → Supplier | Optional, SET_NULL |
| `warehouse` | FK → Warehouse | Optional, SET_NULL |
| `stock_quantity` | integer | Default: 0 |
| `weight_kg` | decimal(10,2) | Nullable |
| `dimensions` | string(100) | |
| `is_active` | boolean | Default: true |
| `created_at` | datetime | Auto |
| `updated_at` | datetime | Auto |

**Relations:** `shipment_items` (reverse FK)

---

### Driver

| Field | Type | Notes |
|-------|------|-------|
| `id` | BigInt (PK) | Auto |
| `user` | FK → User | Optional, SET_NULL |
| `license_number` | string(50) | **Required** |
| `phone` | string(20) | |
| `email` | email(254) | |
| `is_available` | boolean | Default: true |
| `created_at` | datetime | Auto |
| `updated_at` | datetime | Auto |

**Relations:** `transports` (reverse FK)

---

### Transport

| Field | Type | Notes |
|-------|------|-------|
| `id` | BigInt (PK) | Auto |
| `plate_number` | string(20) | **Unique, Required** |
| `vehicle_type` | string(50) | |
| `vehicle_model` | string(100) | DB column: `model` |
| `capacity_kg` | decimal(10,2) | Nullable |
| `is_available` | boolean | Default: true |
| `driver` | FK → Driver | Optional, SET_NULL |
| `created_at` | datetime | Auto |
| `updated_at` | datetime | Auto |

**Relations:** `routes` (reverse FK)

---

### Route

| Field | Type | Notes |
|-------|------|-------|
| `id` | BigInt (PK) | Auto |
| `name` | string(255) | **Required** |
| `transport` | FK → Transport | Optional, SET_NULL |
| `status` | string(20) | Default: `pending` |
| `estimated_start` | datetime | Nullable |
| `actual_start` | datetime | Nullable |
| `estimated_end` | datetime | Nullable |
| `actual_end` | datetime | Nullable |
| `created_at` | datetime | Auto |
| `updated_at` | datetime | Auto |

**Status choices:** `pending`, `in_progress`, `completed`
**Relations:** `stops` (reverse FK, CASCADE delete)

---

### RouteStop

| Field | Type | Notes |
|-------|------|-------|
| `id` | BigInt (PK) | Auto |
| `route` | FK → Route | CASCADE |
| `order` | integer | **Required** (position in route) |
| `address` | text | |
| `city` | string(100) | |
| `estimated_arrival` | datetime | Nullable |
| `actual_arrival` | datetime | Nullable |
| `status` | string(20) | Default: `pending` |
| `notes` | text | |

**Status choices:** `pending`, `arrived`, `completed`

---

### Shipment

| Field | Type | Notes |
|-------|------|-------|
| `id` | BigInt (PK) | Auto |
| `tracking_number` | string(50) | **Unique, Required** |
| `customer` | FK → Customer | CASCADE |
| `warehouse` | FK → Warehouse | Optional, SET_NULL |
| `origin_address` | text | |
| `destination_address` | text | **Required** |
| `destination_city` | string(100) | **Required** |
| `destination_country` | string(100) | **Required** |
| `status` | string(20) | Default: `pending` |
| `scheduled_pickup` | datetime | Nullable |
| `actual_pickup` | datetime | Nullable |
| `scheduled_delivery` | datetime | Nullable |
| `actual_delivery` | datetime | Nullable |
| `shipping_cost` | decimal(10,2) | Default: 0 |
| `weight_kg` | decimal(10,2) | Nullable |
| `notes` | text | |
| `created_at` | datetime | Auto |
| `updated_at` | datetime | Auto |

**Status choices:** `pending`, `assigned`, `in_transit`, `delivered`, `cancelled`
**Relations:** `items` (reverse FK, CASCADE delete)

---

### ShipmentItem

| Field | Type | Notes |
|-------|------|-------|
| `id` | BigInt (PK) | Auto |
| `shipment` | FK → Shipment | CASCADE |
| `product` | FK → Product | CASCADE |
| `quantity` | integer | Default: 1 |
| `unit_price` | decimal(10,2) | **Required** |

---

## Frontend TypeScript Types (generated)

Types for frontend usage should mirror the Django model fields with these conventions:
- `DecimalField` → `string` (API returns strings for decimals)
- `DateTimeField` → `string` (ISO 8601)
- `ForeignKey` → `number` (ID) in requests, `object` in detail responses
- `BooleanField` → `boolean`
- `TextField` → `string`
- All timestamps (`created_at`, `updated_at`) → `string`
