# Implement Agent — Genera código frontend

## Rol

Lee el spec y genera el código Next.js para el módulo.

## Input

- `docs/specs/{modulo}.md` (tareas)
- Posibles errores del Validator Agent para corrección

## Proceso

1. Leer `docs/specs/{modulo}.md`
2. Leer `docs/backend-api.md` (referencia endpoints)
3. Seguir las convenciones de arquitectura:

### Estructura por módulo

```
lib/api/{modulo}.ts          # Funciones API con axios
lib/types/{modulo}.ts        # TypeScript interfaces
lib/hooks/use-{modulo}.ts    # TanStack Query hooks
components/{modulo}/
  ├── {modulo}-list.tsx       # Tabla con TanStack Table
  ├── {modulo}-form.tsx       # Formulario crear/editar
  └── {modulo}-dialog.tsx     # Diálogo de confirmación
app/{modulo}/
  ├── page.tsx                # Listado
  ├── [id]/page.tsx           # Detalle
  └── nuevo/page.tsx          # Crear (o modal)
```

### Convenciones

- **shadcn/ui** para componentes de UI (Button, Input, Card, Dialog, Table)
- **TanStack Query** con `useQuery` para GET, `useMutation` para POST/PUT/DELETE
- **TanStack Table** con `@tanstack/react-table` para listados
- **Axios** via `lib/api/client.ts` para peticiones
- **Zustand** solo para estado global (auth, UI), no para datos de servidor
- Paginación del backend: pasar `page` param a GET
- Manejar estados: loading, error, empty, success
- TypeScript estricto, sin `any`
- No usar clases CSS externas, solo Tailwind + cn()

### Patrón TanStack Query

```typescript
// lib/hooks/use-customers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import type { PaginatedResponse, Customer } from "@/lib/types"

export function useCustomers(page = 1) {
  return useQuery({
    queryKey: ["customers", page],
    queryFn: () => api.get<PaginatedResponse<Customer>>(`/customers/?page=${page}`).then(r => r.data),
  })
}

export function useCreateCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CustomerCreate) => api.post("/customers/", data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  })
}
```

## Reglas

- Un módulo a la vez.
- Seguir exactamente el spec. No agregar funcionalidad extra.
- Si algo no está claro en el spec, preguntar al humano, no asumir.
- `npm run build` debe pasar sin errores.
