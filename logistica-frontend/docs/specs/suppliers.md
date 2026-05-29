# Spec: Suppliers

## Dependencias

- Auth (requiere login)

## Endpoints

| Método | URL | Desc | Request | Response |
|--------|-----|------|---------|----------|
| GET | `/suppliers/` | Listar (paginado) | `?page=1` | `PaginatedResponse<SupplierList>` |
| POST | `/suppliers/` | Crear | `{ company_name, contact_name?, email?, phone?, address?, city?, country? }` | `SupplierDetail` |
| GET | `/suppliers/{id}/` | Detalle | — | `SupplierDetail` |
| PUT | `/suppliers/{id}/` | Actualizar | — | `SupplierDetail` |
| PATCH | `/suppliers/{id}/` | Actualizar parcial | — | `SupplierDetail` |
| DELETE | `/suppliers/{id}/` | Eliminar | — | 204 |

## Routing

| Ruta | Componente | Protegida |
|------|-----------|-----------|
| `/suppliers` | SuppliersPage | Sí |

## Tareas

- [x] **Tarea 1: Types** — `lib/types/supplier.ts`
- [x] **Tarea 2: API layer** — `lib/api/suppliers.ts`
- [x] **Tarea 3: Hooks** — `lib/hooks/use-suppliers.ts`
- [x] **Tarea 4: List component** — `components/suppliers/suppliers-list.tsx` con search multi-campo (empresa, contacto, email, ciudad)
- [x] **Tarea 5: Form component** — `components/suppliers/supplier-form.tsx` con todos los campos opcionales menos company_name
- [x] **Tarea 6: Delete dialog** — `components/suppliers/delete-dialog.tsx`
- [x] **Tarea 7: Page** — `app/(protected)/suppliers/page.tsx`
