# Spec: Auth

## Dependencias

- Ninguna (módulo inicial)

## Endpoints

| Método | URL | Desc | Request | Response |
|--------|-----|------|---------|----------|
| POST | `/auth/login/` | Iniciar sesión | `{ username, password }` | `{ access, refresh }` |
| POST | `/auth/refresh/` | Refrescar token | `{ refresh }` | `{ access }` |
| POST | `/auth/logout/` | Cerrar sesión | (auth) | 200 |

## UI Requirements

### Login Page (`/login`)

- Formulario centrado con campos:
  - **Usuario** (input text, required)
  - **Contraseña** (input password, required)
  - Botón "Iniciar sesión"
- Estado loading: botón deshabilitado + spinner
- Estado error: mostrar mensaje de error (credenciales inválidas, error de conexión)
- En success: redirigir a `/` (dashboard/home)
- Diseño: card centrada en pantalla, logo/título arriba

### Auth Guard

- Layout o wrapper que verifica `isAuthenticated` del store
- Si no autenticado → redirect a `/login`
- Si autenticado → renderizar children
- Proteger todas las rutas excepto `/login`

### Navbar (básico)

- Mostrar nombre de usuario
- Botón "Cerrar sesión"

## Tipos TypeScript

```typescript
// Ya existen en lib/types/index.ts
interface AuthTokens {
  access: string
  refresh: string
}

interface LoginRequest {
  username: string
  password: string
}
```

## Routing

| Ruta | Componente | Protegida |
|------|-----------|-----------|
| `/login` | LoginPage | No |
| `/` | HomePage | Sí (redirect si no auth) |

## Tareas

- [x] **Tarea 1: Providers setup** — `app/providers.tsx` con `QueryClientProvider`, envuelto en `layout.tsx`
- [x] **Tarea 2: Login page** — `app/login/page.tsx` con formulario centrado + redirect si ya autenticado
- [x] **Tarea 3: Login form component** — `components/auth/login-form.tsx` con shadcn Card/Input/Button/Label + loading spinner + error state
- [x] **Tarea 4: Auth guard layout** — `app/(protected)/layout.tsx` que verifica auth y redirige a `/login`
- [x] **Tarea 5: Home page** — `app/(protected)/page.tsx` con dashboard básico
- [x] **Tarea 6: Navbar** — `components/auth/navbar.tsx` con username + logout
- [x] **Tarea 7: SSR safety** — `lib/store/auth.store.ts` con `getInitialAuth()` guard + `init()` en useEffect
