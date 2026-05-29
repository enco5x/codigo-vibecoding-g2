# Spec: Shipments (Core)

## Dependencias

- Auth (requiere login)
- Customers (FK — dropdown select)
- Warehouses (FK — dropdown select)
- Products (FK — items)

## Endpoints

| Método | URL | Desc | Request | Response |
|--------|-----|------|---------|----------|
| GET | `/shipments/` | Listar | `?page=1` | `PaginatedResponse<ShipmentList>` |
| POST | `/shipments/` | Crear | `{ customer, warehouse?, origin_address?, destination_address, destination_city, destination_country, scheduled_pickup?, scheduled_delivery?, weight_kg?, notes? }` | `ShipmentDetail` |
| GET | `/shipments/{id}/` | Detalle | — | `ShipmentDetail` (con items) |
| GET | `/shipments/tracking/{tn}/` | Tracking | — | `ShipmentDetail` |
| PUT | `/shipments/{id}/` | Actualizar | — | `ShipmentDetail` |
| PATCH | `/shipments/{id}/` | Parcial | — | `ShipmentDetail` |
| PATCH | `/shipments/{id}/status/` | Cambiar estado | `{ status }` | `ShipmentDetail` |
| POST | `/shipments/{id}/items/` | Agregar item | `{ product, quantity, unit_price }` | `ShipmentItem` |
| DELETE | `/shipments/{id}/` | Eliminar | — | 204 |

## Routing

| Ruta | Componente | Protegida |
|------|-----------|-----------|
| `/shipments` | ShipmentsPage | Sí |
| `/shipments/[id]` | ShipmentDetailPage | Sí |

## Tareas

- [x] **Tarea 1: Types** — `lib/types/shipment.ts` (ShipmentList, Detail, Create, Item, StatusChoice, STATUS_CHOICES, STATUS_COLORS)
- [x] **Tarea 2: API layer** — `lib/api/shipments.ts` (CRUD + status + items + tracking)
- [x] **Tarea 3: Hooks** — `lib/hooks/use-shipments.ts`
- [x] **Tarea 4: List component** — `components/shipments/shipments-list.tsx` con status badge + search multi-campo + filtro status + link a detalle
- [x] **Tarea 5: Form component** — `components/shipments/shipment-form.tsx` con selects FK customer/warehouse + fechas datetime-local
- [x] **Tarea 6: Status component** — `components/shipments/status.tsx` (badge con colores por estado)
- [x] **Tarea 7: Items manager** — `components/shipments/shipment-items.tsx` (tabla items + dialog agregar con select product + auto-precio)
- [x] **Tarea 8: Detail page** — `app/(protected)/shipments/[id]/page.tsx` (info + status + items + cambio estado + eliminar)
- [x] **Tarea 9: List page** — `app/(protected)/shipments/page.tsx`
