# Logística Frontend — Agents Configuration

## Project Overview

Frontend de plataforma de gestión logística. Monorepo raíz: `codigo-vibecoding-g2/`.

```
codigo-vibecoding-g2/
├── logistica-api/        # Django REST API (Puerto 8000) ← Backend
└── logistica-frontend/   # Next.js App (Puerto 3000)
```

## Stack Tecnológico

- **Lenguaje:** TypeScript 5.x
- **Framework:** Next.js 16.2.6 (App Router)
- **UI:** React 19.2.4 + shadcn/ui (Slate)
- **Estilos:** Tailwind CSS v4
- **Linting:** ESLint 9 + `eslint-config-next`
- **HTTP Client:** Axios (con interceptors JWT)
- **Server State:** TanStack Query
- **Tablas:** TanStack Table
- **Client State:** Zustand (auth, UI)

## Scripts

```bash
cd logistica-frontend
npm run dev    # http://localhost:3000
npm run build  # Producción
npm run start  # Servir build
npm run lint   # ESLint
```

## Estructura de Carpetas

```
app/
├── {modulo}/           # Rutas por módulo
│   ├── page.tsx        # Listado
│   ├── [id]/page.tsx   # Detalle
│   └── nuevo/page.tsx  # Crear
├── globals.css         # Estilos globales Tailwind + shadcn
├── layout.tsx          # Root layout
└── page.tsx            # Home / Dashboard
components/
├── ui/                 # shadcn components
└── {modulo}/           # Feature components
lib/
├── api/
│   ├── client.ts       # Axios instance + interceptors
│   └── {modulo}.ts     # API functions
├── types/
│   ├── index.ts        # Tipos base compartidos
│   └── {modulo}.ts     # Tipos del módulo
├── store/
│   └── auth.store.ts   # Zustand auth store
├── hooks/
│   └── use-{modulo}.ts # TanStack Query hooks
└── utils.ts            # cn() helper
docs/
├── backend-api.md      # Endpoints backend
├── backend-models.md   # Modelos DB
├── sdd-workflow.md     # SDD methodology
└── specs/              # Specs por módulo
.opencode/agents/
├── orquestador.md      # Entry point SDD
├── spec-agent.md       # Genera specs
├── implement-agent.md  # Implementa código
└── validator-agent.md  # Valida código vs spec
public/                 # Assets estáticos
```

## Convenciones

- **Rutas:** App Router (`app/` directory). Archivo `page.tsx` para cada ruta.
- **Componentes:** Archivos `.tsx` con named export por defecto.
- **Estilos:** Tailwind CSS utility classes. Preferir `cn()` para condicionales.
- **Path alias:** `@/*` mapea a raíz del proyecto (`logistica-frontend/`).
- **Fuente:** Geist (variable via `next/font/google`).
- **Arquitectura por módulo:** `lib/api/{modulo}.ts` + `lib/types/{modulo}.ts` + `lib/hooks/use-{modulo}.ts` + `components/{modulo}/` + `app/{modulo}/`
- **UI:** shadcn/ui para componentes base. No usar HTML nativo para botones/inputs/tablas.

## APIs / Fetching

**Backend:** `http://localhost:8000/api/v1/` — Django REST API (`../logistica-api/`)
**Auth:** JWT Bearer (login → access token → header)
**Base URL:** `http://localhost:8000/api/v1`
**Format:** JSON | Pagination: 20/page

### Módulos Backend (8 + Auth)

| Módulo | Endpoints | Descripción |
|--------|-----------|-------------|
| Auth | `auth/login/`, `auth/refresh/`, `auth/logout/` | JWT login/refresh/logout |
| Customers | `customers/` | CRUD clientes |
| Warehouses | `warehouses/` | CRUD bodegas |
| Suppliers | `suppliers/` | CRUD proveedores |
| Products | `products/`, `products/by-sku/{sku}/` | CRUD productos + lookup por SKU |
| Drivers | `drivers/` | CRUD conductores |
| Transports | `transports/` | CRUD vehículos |
| Shipments | `shipments/`, `shipments/tracking/{tn}/`, `shipments/{id}/status/`, `shipments/{id}/items/` | CRUD envíos + tracking + cambio estado + items |
| Routes | `routes/`, `routes/{id}/stops/` | CRUD rutas + paradas |

### Metodología SDD

Cada módulo sigue el flujo: **Spec → Human Review → Implement → Validate**

Gestionado por 4 agentes en `.opencode/agents/`:

| Agente | Rol |
|--------|-----|
| **Orquestador** | Entry point. Recibe prompt, delega al agente según fase. |
| **Spec Agent** | Lee docs/backend-*.md, crea `docs/specs/{modulo}.md` con tareas. |
| **Implement Agent** | Lee spec, genera código Next.js siguiendo convenciones. |
| **Validator Agent** | Compara spec vs código, reporta errores, actualiza spec. |

**Orden módulos:** Auth → Customers → Warehouses → Suppliers → Products → Drivers → Transports → Shipments → Routes
Ver [`docs/mvp.md`](docs/mvp.md) para alcance detallado de cada módulo.

### Referencias

- [`docs/backend-api.md`](docs/backend-api.md) — Endpoints, request/response shapes, auth
- [`docs/backend-models.md`](docs/backend-models.md) — Modelos DB, campos, relaciones
- [`docs/sdd-workflow.md`](docs/sdd-workflow.md) — SDD methodology
- [`docs/mvp.md`](docs/mvp.md) — Plan de módulos y orden
- [`.opencode/agents/orquestador.md`](.opencode/agents/orquestador.md) — Entry point SDD
