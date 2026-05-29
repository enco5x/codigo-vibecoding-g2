# Spec: Warehouses

## Dependencias

- Auth (requiere login)

## Endpoints

| Método | URL | Desc | Request | Response |
|--------|-----|------|---------|----------|
| GET | `/warehouses/` | Listar (paginado) | `?page=1` | `PaginatedResponse<WarehouseList>` |
| POST | `/warehouses/` | Crear | `{ name, code, address?, city?, country?, capacity?, is_active? }` | `WarehouseDetail` |
| GET | `/warehouses/{id}/` | Detalle | — | `WarehouseDetail` |
| PUT | `/warehouses/{id}/` | Actualizar | `{ name, code, ... }` | `WarehouseDetail` |
| PATCH | `/warehouses/{id}/` | Actualizar parcial | `{ campo?: valor }` | `WarehouseDetail` |
| DELETE | `/warehouses/{id}/` | Eliminar | — | 204 |

## Tipos TypeScript

```typescript
// lib/types/warehouse.ts

interface WarehouseList {
  id: number
  name: string
  code: string
  city: string
  is_active: boolean
}

interface WarehouseDetail {
  id: number
  name: string
  code: string
  address: string
  city: string
  country: string
  capacity: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface WarehouseCreate {
  name: string
  code: string
  address?: string
  city?: string
  country?: string
  capacity?: number | null
  is_active?: boolean
}
```

## UI Requirements

### List View (`/warehouses`)

- **Título:** "Bodegas"
- **Botón:** "+ Nueva bodega"
- **Tabla** (TanStack Table):
  | Columna | Data |
  |---------|------|
  | Nombre | `name` |
  | Código | `code` |
  | Ciudad | `city` |
  | Capacidad | `capacity` (formateado, "-" si null) |
  | Activo | `is_active` (badge Sí/No) |
  | Acciones | Editar / Eliminar |
- **Búsqueda:** input que filtra por `name` (client-side)
- **Filtro:** toggle/select por `is_active`
- **Paginación:** controles de página + total registros
- **Estados:** loading, empty ("No hay bodegas"), error (mensaje + retry)

### Form (Crear/Editar) — Modal Dialog

- Modal con shadcn Dialog
- Título: "Nueva bodega" / "Editar bodega"
- Campos:
  | Campo | Tipo | Requerido | Validaciones |
  |-------|------|-----------|-------------|
  | Nombre | Input text | Sí | |
  | Código | Input text | Sí | |
  | Dirección | Textarea | No | |
  | Ciudad | Input text | No | |
  | País | Input text | No | |
  | Capacidad | Input number | No | Número entero positivo |
  | Activo | Switch/checkbox | No | default true |
- Botones: Cancelar + Guardar
- Estados: loading, error

### Delete

- Confirmación: "¿Eliminar bodega {name}?"
- Botones: Cancelar + Eliminar

## Routing

| Ruta | Componente | Protegida |
|------|-----------|-----------|
| `/warehouses` | WarehousesPage | Sí |

## Tareas

- [x] **Tarea 1: Types** — `lib/types/warehouse.ts`
- [x] **Tarea 2: API layer** — `lib/api/warehouses.ts`
- [x] **Tarea 3: Hooks** — `lib/hooks/use-warehouses.ts`
- [x] **Tarea 4: List component** — `components/warehouses/warehouses-list.tsx` con TanStack Table + search + filter is_active + paginación + loading/empty/error
- [x] **Tarea 5: Form component** — `components/warehouses/warehouse-form.tsx` con Dialog + Switch para is_active
- [x] **Tarea 6: Delete dialog** — `components/warehouses/delete-dialog.tsx`
- [x] **Tarea 7: Page** — `app/(protected)/warehouses/page.tsx`
