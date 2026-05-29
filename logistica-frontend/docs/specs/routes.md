# Spec: Routes

## Dependencias

- Auth (requiere login)
- Transports (FK — dropdown select)

## Endpoints

| Método | URL | Desc | Request | Response |
|--------|-----|------|---------|----------|
| GET | `/routes/` | Listar | `?page=1` | `PaginatedResponse<RouteList>` |
| POST | `/routes/` | Crear | `{ name, transport?, estimated_start?, estimated_end? }` | `RouteDetail` |
| GET | `/routes/{id}/` | Detalle | — | `RouteDetail` (con stops) |
| PUT | `/routes/{id}/` | Actualizar | — | `RouteDetail` |
| PATCH | `/routes/{id}/` | Parcial | — | `RouteDetail` |
| DELETE | `/routes/{id}/` | Eliminar | — | 204 |
| GET | `/routes/{id}/stops/` | Listar stops | — | `RouteStop[]` |
| POST | `/routes/{id}/stops/` | Agregar stop | `{ order, address?, city?, estimated_arrival?, notes? }` | `RouteStop` |
| PUT | `/routes/{id}/stops/{stop_id}/` | Actualizar stop | — | `RouteStop` |

## Routing

| Ruta | Componente | Protegida |
|------|-----------|-----------|
| `/routes` | RoutesPage | Sí |
| `/routes/[id]` | RouteDetailPage | Sí |

## Tareas

- [x] **Tarea 1: Types** — `lib/types/route.ts` (RouteList, Detail, Create, RouteStop, RouteStopCreate, status choices)
- [x] **Tarea 2: API layer** — `lib/api/routes.ts` (CRUD + stops)
- [x] **Tarea 3: Hooks** — `lib/hooks/use-routes.ts`
- [x] **Tarea 4: List component** — `components/routes/routes-list.tsx` con status badge + search + filtro status + 5 columnas
- [x] **Tarea 5: Form component** — `components/routes/route-form.tsx` con select FK transport + fechas
- [x] **Tarea 6: Stops manager** — `components/routes/route-stops.tsx` (tabla stops ordenadas + agregar con orden/dirección/ciudad)
- [x] **Tarea 7: Detail page** — `app/(protected)/routes/[id]/page.tsx` (info + stops + eliminar)
- [x] **Tarea 8: List page** — `app/(protected)/routes/page.tsx`
