# Spec: Products

## Dependencias

- Auth (requiere login)
- Suppliers (FK — dropdown select)
- Warehouses (FK — dropdown select)

## Endpoints

| Método | URL | Desc | Request | Response |
|--------|-----|------|---------|----------|
| GET | `/products/` | Listar (paginado) | `?page=1` | `PaginatedResponse<ProductList>` |
| POST | `/products/` | Crear | `{ sku, name, description?, category?, unit_price, supplier?, warehouse?, stock_quantity?, weight_kg?, dimensions?, is_active? }` | `ProductDetail` |
| GET | `/products/{id}/` | Detalle | — | `ProductDetail` |
| GET | `/products/by-sku/{sku}/` | Lookup por SKU | — | `ProductDetail` |
| PUT | `/products/{id}/` | Actualizar | — | `ProductDetail` |
| PATCH | `/products/{id}/` | Actualizar parcial | — | `ProductDetail` |
| DELETE | `/products/{id}/` | Eliminar | — | 204 |

## Routing

| Ruta | Componente | Protegida |
|------|-----------|-----------|
| `/products` | ProductsPage | Sí |

## Tareas

- [x] **Tarea 1: Types** — `lib/types/product.ts`
- [x] **Tarea 2: API layer** — `lib/api/products.ts` (incluye getBySku)
- [x] **Tarea 3: Hooks** — `lib/hooks/use-products.ts`
- [x] **Tarea 4: List component** — `components/products/products-list.tsx` con search por SKU/nombre, filtro is_active, 8 columnas
- [x] **Tarea 5: Form component** — `components/products/product-form.tsx` con selects FK para supplier/warehouse, Switch is_active, Textarea descripción, peso/dimensiones
- [x] **Tarea 6: Delete dialog** — `components/products/delete-dialog.tsx`
- [x] **Tarea 7: Page** — `app/(protected)/products/page.tsx`
