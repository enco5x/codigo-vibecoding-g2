# Spec: Drivers

## Dependencias

- Auth (requiere login)

## Endpoints

| Método | URL | Desc | Request | Response |
|--------|-----|------|---------|----------|
| GET | `/drivers/` | Listar (paginado) | `?page=1` | `PaginatedResponse<DriverList>` |
| POST | `/drivers/` | Crear | `{ license_number, phone?, email?, is_available? }` | `DriverDetail` |
| GET | `/drivers/{id}/` | Detalle | — | `DriverDetail` |
| PUT | `/drivers/{id}/` | Actualizar | — | `DriverDetail` |
| PATCH | `/drivers/{id}/` | Actualizar parcial | — | `DriverDetail` |
| DELETE | `/drivers/{id}/` | Eliminar | — | 204 |

## Routing

| Ruta | Componente | Protegida |
|------|-----------|-----------|
| `/drivers` | DriversPage | Sí |

## Tareas

- [x] **Tarea 1: Types** — `lib/types/driver.ts`
- [x] **Tarea 2: API layer** — `lib/api/drivers.ts`
- [x] **Tarea 3: Hooks** — `lib/hooks/use-drivers.ts`
- [x] **Tarea 4: List component** — `components/drivers/drivers-list.tsx` con search + filtro is_available + badge disponible/no disponible
- [x] **Tarea 5: Form component** — `components/drivers/driver-form.tsx` con Switch is_available
- [x] **Tarea 6: Delete dialog** — `components/drivers/delete-dialog.tsx`
- [x] **Tarea 7: Page** — `app/(protected)/drivers/page.tsx`
