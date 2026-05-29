# MVP — Plan de Módulos

## Stack Frontend

| Herramienta | Propósito |
|------------|-----------|
| shadcn/ui | Componentes base (Button, Input, Card, Dialog, Table, Form) |
| TanStack Query | Server state (fetch, cache, mutations) |
| TanStack Table | Tablas con sort/filter/pagination |
| Axios | HTTP client con interceptors |
| Zustand | Client state global (auth, UI) |

## Orden de Construcción

Cada módulo sigue SDD: **Spec → Human Review → Implement → Validate**

```
Phase 0: Setup (completado)
Phase 1: Auth
Phase 2: Customers
Phase 3: Warehouses
Phase 4: Suppliers
Phase 5: Products
Phase 6: Drivers
Phase 7: Transports
Phase 8: Shipments
Phase 9: Routes
```

---

## Phase 1: Auth

**Dependencias:** Ninguna

**Alcance:**
- Login page (`/login`) con formulario username + password
- Llamada a `POST /api/v1/auth/login/`
- Persistencia de tokens (localStorage via Zustand store)
- Interceptor axios para agregar Bearer token + refresh automático
- Logout (limpiar tokens, redirect a login)
- Protección de rutas (wrapper o layout que verifica auth)
- Redirect a login si no autenticado

**NO incluye:**
- Register (no hay endpoint de registro en el MVP)
- Password reset

---

## Phase 2: Customers

**Dependencias:** Auth (requiere login)

**Alcance:**
- Listado paginado con TanStack Table
- Crear cliente (modal con formulario)
- Editar cliente (modal con formulario pre-cargado)
- Eliminar cliente (confirmación)
- Columnas: company_name, contact_name, email, city, created_at
- Búsqueda/filtro por company_name

**Endpoints:** `GET/POST/PUT/DELETE /api/v1/customers/`

---

## Phase 3: Warehouses

**Dependencias:** Auth

**Alcance:**
- Listado paginado con TanStack Table
- CRUD completo (crear, editar, eliminar)
- Columnas: name, code, city, capacity, is_active, created_at
- Filtro por is_active

**Endpoints:** `GET/POST/PUT/DELETE /api/v1/warehouses/`

---

## Phase 4: Suppliers

**Dependencias:** Auth

**Alcance:**
- Listado paginado con TanStack Table
- CRUD completo
- Columnas: company_name, contact_name, email, city, created_at

**Endpoints:** `GET/POST/PUT/DELETE /api/v1/suppliers/`

---

## Phase 5: Products

**Dependencias:** Auth, Suppliers, Warehouses

**Alcance:**
- Listado paginado con TanStack Table
- CRUD completo
- Columnas: sku, name, category, unit_price, stock_quantity, supplier_name, warehouse_name, is_active
- Selectores: supplier (FK), warehouse (FK)
- Búsqueda por SKU
- Lookup endpoint `by-sku/{sku}` para búsqueda rápida

**Endpoints:** `GET/POST/PUT/DELETE /api/v1/products/`, `GET /api/v1/products/by-sku/{sku}/`

---

## Phase 6: Drivers

**Dependencias:** Auth

**Alcance:**
- Listado paginado con TanStack Table
- CRUD completo
- Columnas: license_number, phone, email, is_available, created_at
- Filtro por is_available

**Endpoints:** `GET/POST/PUT/DELETE /api/v1/drivers/`

---

## Phase 7: Transports

**Dependencias:** Auth, Drivers

**Alcance:**
- Listado paginado con TanStack Table
- CRUD completo
- Columnas: plate_number, vehicle_type, vehicle_model, capacity_kg, driver_name, is_available
- Selector: driver (FK dropdown)

**Endpoints:** `GET/POST/PUT/DELETE /api/v1/transports/`

---

## Phase 8: Shipments (Core)

**Dependencias:** Auth, Customers, Warehouses, Products

**Alcance:**
- Listado paginado con TanStack Table
- Crear envío (formulario con selects para customer, warehouse)
- Detalle de envío (con items anidados)
- Tracking por tracking_number
- Actualización de estado (status badge/chip)
- Agregar items al envío (product selector + quantity + price)
- Columnas: tracking_number, customer_name, status, destination_city, scheduled_delivery, shipping_cost, created_at

**Endpoints:**
- `GET/POST/PUT/DELETE /api/v1/shipments/`
- `GET /api/v1/shipments/{id}/` (detail con customer/warehouse/items)
- `GET /api/v1/shipments/tracking/{tracking_number}/`
- `PATCH /api/v1/shipments/{id}/status/`
- `POST /api/v1/shipments/{id}/items/`

---

## Phase 9: Routes

**Dependencias:** Auth, Transports

**Alcance:**
- Listado paginado con TanStack Table
- CRUD completo
- Gestión de paradas (RouteStops) anidadas
- Columnas: name, transport_plate, status, estimated_start, estimated_end, created_at
- Vista detalle con stops

**Endpoints:**
- `GET/POST/PUT/DELETE /api/v1/routes/`
- `GET/POST /api/v1/routes/{id}/stops/`
- `PUT /api/v1/routes/{id}/stops/{stop_id}/`

---

## Global: Sidebar Navigation ✅

**Cuando:** Completado.

**Tipo:** Sidebar izquierdo fijo.

**Alcance:**
- Sidebar izquierdo con links a todos los módulos
- Dashboard (`/`), Customers, Warehouses, Suppliers, Products, Drivers, Transports, Shipments, Routes
- Highlight del módulo activo
- Responsive (colapsable en mobile con overlay)
