# Spec: Transports

## Dependencias

- Auth (requiere login)
- Drivers (FK — dropdown select)

## Endpoints

| Método | URL | Desc | Request | Response |
|--------|-----|------|---------|----------|
| GET | `/transports/` | Listar (paginado) | `?page=1` | `PaginatedResponse<TransportList>` |
| POST | `/transports/` | Crear | `{ plate_number, vehicle_type?, vehicle_model?, capacity_kg?, is_available?, driver? }` | `TransportDetail` |
| GET | `/transports/{id}/` | Detalle | — | `TransportDetail` |
| PUT | `/transports/{id}/` | Actualizar | — | `TransportDetail` |
| PATCH | `/transports/{id}/` | Actualizar parcial | — | `TransportDetail` |
| DELETE | `/transports/{id}/` | Eliminar | — | 204 |

## Routing

| Ruta | Componente | Protegida |
|------|-----------|-----------|
| `/transports` | TransportsPage | Sí |

## Tareas

- [x] **Tarea 1: Types** — `lib/types/transport.ts`
- [x] **Tarea 2: API layer** — `lib/api/transports.ts`
- [x] **Tarea 3: Hooks** — `lib/hooks/use-transports.ts`
- [x] **Tarea 4: List component** — `components/transports/transports-list.tsx` con search + filtro is_available + 5 columnas
- [x] **Tarea 5: Form component** — `components/transports/transport-form.tsx` con select FK driver + Switch is_available + capacity_kg
- [x] **Tarea 6: Delete dialog** — `components/transports/delete-dialog.tsx`
- [x] **Tarea 7: Page** — `app/(protected)/transports/page.tsx`
