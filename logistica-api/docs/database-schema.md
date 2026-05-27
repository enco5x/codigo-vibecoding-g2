# Database Schema - logistica-api

## Overview

This document describes the database schema for the logistics API. The schema uses Django's existing tables and extends them with new models for the logistics modules.

---

## Django Default Tables (Read-Only)

These tables are created by Django and should not be modified:

| Table | Description |
|-------|-------------|
| `auth_user` | System users (extends with profile) |
| `auth_group` | User groups |
| `auth_permission` | Permissions |
| `django_content_type` | Content types for permissions |
| `auth_user_groups` | User-Group relationship |
| `auth_user_user_permissions` | User-Permission relationship |
| `auth_group_permissions` | Group-Permission relationship |

---

## Custom Tables

### 1. customer

Clients - companies or individuals who generate shipments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO | Auto-incremental ID |
| user_id | INT | FK → auth_user (nullable) | Associated user account |
| company_name | VARCHAR(255) | NOT NULL | Company name |
| contact_name | VARCHAR(255) | | Contact person name |
| email | VARCHAR(254) | | Email address |
| phone | VARCHAR(20) | | Phone number |
| address | TEXT | | Full address |
| city | VARCHAR(100) | | City |
| country | VARCHAR(100) | | Country |
| created_at | DATETIME | NOT NULL | Creation timestamp |
| updated_at | DATETIME | NOT NULL | Last update timestamp |

---

### 2. warehouse

Warehouses - storage and dispatch points for products.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO | Auto-incremental ID |
| name | VARCHAR(255) | NOT NULL | Warehouse name |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Unique warehouse code |
| address | TEXT | | Full address |
| city | VARCHAR(100) | | City |
| country | VARCHAR(100) | | Country |
| capacity | INT | | Maximum storage capacity |
| is_active | BOOLEAN | NOT NULL, DEFAULT=True | Active status |
| created_at | DATETIME | NOT NULL | Creation timestamp |
| updated_at | DATETIME | NOT NULL | Last update timestamp |

---

### 3. supplier

Suppliers - companies that provide products.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO | Auto-incremental ID |
| company_name | VARCHAR(255) | NOT NULL | Supplier company name |
| contact_name | VARCHAR(255) | | Contact person name |
| email | VARCHAR(254) | | Email address |
| phone | VARCHAR(20) | | Phone number |
| address | TEXT | | Full address |
| city | VARCHAR(100) | | City |
| country | VARCHAR(100) | | Country |
| created_at | DATETIME | NOT NULL | Creation timestamp |
| updated_at | DATETIME | NOT NULL | Last update timestamp |

---

### 4. product

Products - technology products to be shipped.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO | Auto-incremental ID |
| sku | VARCHAR(50) | UNIQUE, NOT NULL | Stock Keeping Unit |
| name | VARCHAR(255) | NOT NULL | Product name |
| description | TEXT | | Product description |
| category | VARCHAR(100) | | Product category (e.g., electronics) |
| unit_price | DECIMAL(10,2) | NOT NULL, DEFAULT=0.00 | Unit price |
| supplier_id | BIGINT | FK → supplier (nullable) | Supplier reference |
| warehouse_id | BIGINT | FK → warehouse (nullable) | Current warehouse location |
| stock_quantity | INT | NOT NULL, DEFAULT=0 | Available stock |
| weight_kg | DECIMAL(10,2) | | Weight in kilograms |
| dimensions | VARCHAR(100) | | Dimensions (LxWxH) |
| is_active | BOOLEAN | NOT NULL, DEFAULT=True | Active status |
| created_at | DATETIME | NOT NULL | Creation timestamp |
| updated_at | DATETIME | NOT NULL | Last update timestamp |

---

### 5. driver

Drivers - personnel assigned to transport vehicles.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO | Auto-incremental ID |
| user_id | INT | FK → auth_user (nullable) | User account |
| license_number | VARCHAR(50) | NOT NULL | Driver's license number |
| phone | VARCHAR(20) | | Contact phone |
| email | VARCHAR(254) | | Email address |
| is_available | BOOLEAN | NOT NULL, DEFAULT=True | Availability status |
| created_at | DATETIME | NOT NULL | Creation timestamp |
| updated_at | DATETIME | NOT NULL | Last update timestamp |

---

### 6. transport

Transport - vehicles used for delivery.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO | Auto-incremental ID |
| plate_number | VARCHAR(20) | UNIQUE, NOT NULL | Vehicle plate number |
| vehicle_type | VARCHAR(50) | | Vehicle type (truck, van, etc.) |
| model | VARCHAR(100) | | Vehicle model |
| capacity_kg | DECIMAL(10,2) | | Load capacity in kg |
| is_available | BOOLEAN | NOT NULL, DEFAULT=True | Availability status |
| driver_id | BIGINT | FK → driver (nullable) | Assigned driver |
| created_at | DATETIME | NOT NULL | Creation timestamp |
| updated_at | DATETIME | NOT NULL | Last update timestamp |

---

### 7. route

Routes - sequence of stops for a transport.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO | Auto-incremental ID |
| name | VARCHAR(255) | NOT NULL | Route name |
| transport_id | BIGINT | FK → transport (nullable) | Assigned transport |
| status | VARCHAR(20) | NOT NULL, DEFAULT='pending' | Route status |
| estimated_start | DATETIME | | Estimated start time |
| actual_start | DATETIME | | Actual start time |
| estimated_end | DATETIME | | Estimated end time |
| actual_end | DATETIME | | Actual end time |
| created_at | DATETIME | NOT NULL | Creation timestamp |
| updated_at | DATETIME | NOT NULL | Last update timestamp |

**Status values:** `pending`, `in_progress`, `completed`

---

### 8. route_stop

Route Stops - individual stops within a route.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO | Auto-incremental ID |
| route_id | BIGINT | FK → route (NOT NULL) | Parent route |
| order | INT | NOT NULL | Stop order number |
| address | TEXT | | Stop address |
| city | VARCHAR(100) | | Stop city |
| estimated_arrival | DATETIME | | Expected arrival time |
| actual_arrival | DATETIME | | Actual arrival time |
| status | VARCHAR(20) | NOT NULL, DEFAULT='pending' | Stop status |
| notes | TEXT | | Additional notes |

**Status values:** `pending`, `arrived`, `completed`

---

### 9. shipment

Shipments - the core business entity.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO | Auto-incremental ID |
| tracking_number | VARCHAR(50) | UNIQUE, NOT NULL | Unique tracking number |
| customer_id | BIGINT | FK → customer (NOT NULL) | Client reference |
| warehouse_id | BIGINT | FK → warehouse (nullable) | Origin warehouse |
| origin_address | TEXT | | Pickup address |
| destination_address | TEXT | NOT NULL | Delivery address |
| destination_city | VARCHAR(100) | NOT NULL | Delivery city |
| destination_country | VARCHAR(100) | NOT NULL | Delivery country |
| status | VARCHAR(20) | NOT NULL, DEFAULT='pending' | Shipment status |
| scheduled_pickup | DATETIME | | Scheduled pickup time |
| actual_pickup | DATETIME | | Actual pickup time |
| scheduled_delivery | DATETIME | | Scheduled delivery time |
| actual_delivery | DATETIME | | Actual delivery time |
| shipping_cost | DECIMAL(10,2) | NOT NULL, DEFAULT=0.00 | Calculated shipping cost |
| weight_kg | DECIMAL(10,2) | | Total weight |
| notes | TEXT | | Additional notes |
| created_at | DATETIME | NOT NULL | Creation timestamp |
| updated_at | DATETIME | NOT NULL | Last update timestamp |

**Status values:** `pending`, `assigned`, `in_transit`, `delivered`, `cancelled`

---

### 10. shipment_item

Shipment Items - products included in a shipment.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO | Auto-incremental ID |
| shipment_id | BIGINT | FK → shipment (NOT NULL) | Parent shipment |
| product_id | BIGINT | FK → product (NOT NULL) | Product reference |
| quantity | INT | NOT NULL, DEFAULT=1 | Quantity shipped |
| unit_price | DECIMAL(10,2) | NOT NULL | Price at time of shipment |

---

## Relationships Diagram

```
┌─────────────────┐     ┌─────────────────┐
│   auth_user     │     │     customer    │
├─────────────────┤     ├─────────────────┤
│ id              │◄────│ user_id         │
└─────────────────┘     │ id              │
                        └────────┬────────┘
                                 │
                                 │ (1:N)
                                 ▼
┌─────────────────┐     ┌─────────────────┐
│     driver      │     │    shipment     │
├─────────────────┤     ├─────────────────┤
│ user_id ◄───────┤     │ customer_id     │
│ id              │     │ tracking_number │
└────────┬────────┘     │ id              │
         │              └────────┬────────┘
         │                       │
         │                       │ (1:N)
         ▼                       ▼
┌─────────────────┐     ┌──────────────────┐
│    transport    │     │  shipment_item   │
├─────────────────┤     ├──────────────────┤
│ driver_id       │     │ shipment_id      │
│ id              │     │ product_id       │
└────────┬────────┘     │ id               │
         │              └────────┬─────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│      route      │     │     product     │
├─────────────────┤     ├─────────────────┤
│ transport_id    │     │ supplier_id     │
│ id              │     │ warehouse_id    │
└────────┬────────┘     │ id              │
         │              └────────┬────────┘
         │                       │
         │ (1:N)                  │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│   route_stop    │     │    supplier     │
├─────────────────┤     ├─────────────────┤
│ route_id        │     │ id              │
│ order           │     └─────────────────┘
│ id              │
└─────────────────┘

┌─────────────────┐
│    warehouse    │
├─────────────────┤
│ code (unique)   │
│ id              │
└─────────────────┘
```

---

## Summary

| Model | Table Name | Relationships |
|-------|------------|---------------|
| Customer | `customer` | 1:N → Shipment, 1:1 → auth_user |
| Warehouse | `warehouse` | 1:N → Product, 1:N → Shipment |
| Supplier | `supplier` | 1:N → Product |
| Product | `product` | N:1 → Supplier, N:1 → Warehouse, 1:N → ShipmentItem |
| Driver | `driver` | 1:1 → auth_user, 1:N → Transport |
| Transport | `transport` | N:1 → Driver, 1:N → Route |
| Route | `route` | N:1 → Transport, 1:N → RouteStop |
| RouteStop | `route_stop` | N:1 → Route |
| Shipment | `shipment` | N:1 → Customer, N:1 → Warehouse, 1:N → ShipmentItem |
| ShipmentItem | `shipment_item` | N:1 → Shipment, N:1 → Product |