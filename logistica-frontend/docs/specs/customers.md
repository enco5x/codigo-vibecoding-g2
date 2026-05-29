# Spec: Customers

## Dependencias

- Auth (requiere login)

## Endpoints

| Método | URL | Desc | Request | Response |
|--------|-----|------|---------|----------|
| GET | `/customers/` | Listar (paginado) | `?page=1` | `PaginatedResponse<CustomerList>` |
| POST | `/customers/` | Crear | `{ company_name, contact_name?, email?, phone?, address?, city?, country? }` | `CustomerDetail` |
| GET | `/customers/{id}/` | Detalle | — | `CustomerDetail` |
| PUT | `/customers/{id}/` | Actualizar | `{ company_name, contact_name?, ... }` | `CustomerDetail` |
| PATCH | `/customers/{id}/` | Actualizar parcial | `{ campo?: valor }` | `CustomerDetail` |
| DELETE | `/customers/{id}/` | Eliminar | — | 204 |

## Tipos TypeScript

```typescript
// lib/types/customer.ts

interface CustomerList {
  id: number
  company_name: string
  contact_name: string
  email: string
  city: string
}

interface CustomerDetail {
  id: number
  company_name: string
  contact_name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  created_at: string
  updated_at: string
}

interface CustomerCreate {
  company_name: string
  contact_name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
}
```

## UI Requirements

### Layout

- Customers dentro de `(protected)` route group (requiere auth)
- Navbar visible en todas las páginas del módulo

### List View (`/customers`)

- **Título:** "Clientes"
- **Botón:** "+ Nuevo cliente" (abre modal de creación)
- **Tabla** (TanStack Table):
  | Columna | Data |
  |---------|------|
  | Empresa | `company_name` |
  | Contacto | `contact_name` |
  | Email | `email` |
  | Ciudad | `city` |
  | Creado | `created_at` (formateado) |
  | Acciones | Editar / Eliminar |
- **Búsqueda:** input que filtra por `company_name` (client-side)
- **Paginación:** controles de página, mostrar total de registros
- **Estados:** loading (skeleton o spinner), empty ("No hay clientes"), error (mensaje + retry)

### Form (Crear/Editar) — Modal Dialog

- Modal con shadcn Dialog
- Título: "Nuevo cliente" o "Editar cliente"
- Campos:
  | Campo | Tipo | Requerido | Validaciones |
  |-------|------|-----------|-------------|
  | Nombre empresa | Input text | Sí | |
  | Nombre contacto | Input text | No | |
  | Email | Input email | No | Formato email |
  | Teléfono | Input text | No | |
  | Dirección | Textarea | No | |
  | Ciudad | Input text | No | |
  | País | Input text | No | |
- Botones: Cancelar + Guardar
- Estado loading en submit (botón deshabilitado + spinner)
- Validación client-side para campos requeridos
- Success: cerrar modal, refrescar tabla

### Delete

- Confirmación: "¿Eliminar cliente {company_name}?"
- Botones: Cancelar + Eliminar
- En success: refrescar tabla

## Routing

| Ruta | Componente | Protegida |
|------|-----------|-----------|
| `/customers` | CustomersPage | Sí |

## Tareas

- [x] **Tarea 1: Types** — `lib/types/customer.ts` con CustomerList, CustomerDetail, CustomerCreate
- [x] **Tarea 2: API layer** — `lib/api/customers.ts` con CRUD (list, get, create, update, delete)
- [x] **Tarea 3: TanStack Query hooks** — `lib/hooks/use-customers.ts` con useCustomers, useCustomer, useCreateCustomer, useUpdateCustomer, useDeleteCustomer
- [x] **Tarea 4: List component** — `components/customers/customers-list.tsx` con TanStack Table, search, paginación, loading/empty/error
- [x] **Tarea 5: Form component** — `components/customers/customer-form.tsx` con shadcn Dialog + inputs
- [x] **Tarea 6: Delete dialog** — `components/customers/delete-dialog.tsx` con confirmación
- [x] **Tarea 7: Page** — `app/(protected)/customers/page.tsx` que orquesta componentes
