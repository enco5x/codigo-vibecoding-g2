# Task Manager - Agents Configuration

## Project Overview

Monorepo containing a full-stack task management application.

```
codigo-vibecoding-g2/
├── task-manager-backend/   # API REST (Puerto 3001)
└── task-manager-frontend/  # SPA React (Puerto 3002)
```

## Stack Tecnológico

### Backend
- **Lenguaje:** JavaScript (ES Modules)
- **Framework:** Express.js 4.18.2
- **Base de datos:** PostgreSQL + Prisma ORM 7.8.0
- **Auth:** JWT (token almacenado en BD) + bcrypt
- **Documentación:** Swagger UI en `/api-docs`
- **Puerto:** 3001 (configurable via `PORT`)
- **URL Base:** `http://localhost:3001/api`

### Frontend
- **Lenguaje:** JavaScript/JSX
- **Framework:** React 19.2.5
- **Build tool:** Vite 8.0.10
- **Estilos:** TailwindCSS 4.2.4
- **HTTP Client:** Axios
- **Routing:** React Router 7.15.0
- **Puerto:** 3002

## Comunicación

| Frontend → Backend |
|---------------------|
| URL: `http://localhost:3001/api` |
| Auth: Bearer token en header |
| Formato: JSON |

### Endpoints API

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/users/register` | Registrar usuario | No |
| POST | `/api/users/login` | Iniciar sesión | No |
| GET | `/api/tasks` | Listar tareas | Sí |
| GET | `/api/tasks/:id` | Ver tarea | Sí |
| POST | `/api/tasks` | Crear tarea | Sí |
| PUT | `/api/tasks/:id` | Actualizar tarea | Sí |
| DELETE | `/api/tasks/:id` | Eliminar tarea | Sí |

## Estructura de Carpetas

### Backend (`task-manager-backend/`)
```
src/
├── config/db.js           # Configuración Prisma
├── middleware/auth.js     # Middleware JWT
├── docs/                  # Swagger
├── tasks/                 # Módulo tareas
│   ├── tasks.routes.js
│   ├── tasks.controller.js
│   └── tasks.service.js
├── users/                 # Módulo usuarios
│   ├── users.routes.js
│   ├── users.controller.js
│   └── users.service.js
├── utils/helpers.js
├── app.js                 # Express config
└── index.js               # Entry point
prisma/schema.prisma       # Modelos de datos
```

### Frontend (`task-manager-frontend/`)
```
src/
├── api/taskApi.js         # Cliente HTTP
├── components/            # Componentes reutilizables
├── context/               # Context (TaskContext)
├── pages/                 # Páginas/rutas
├── lib/constants.js       # Constantes
├── App.jsx                # Router principal
└── main.jsx               # Entry point
```

## Guía de Features

Al crear una nueva feature, distribuir el trabajo según el tipo:

### Backend Only
- Nuevos endpoints API
- Cambios en schema de Prisma
- Middleware de validación
- Lógica de negocio

### Frontend Only
- Nuevas páginas/componentes
- Cambios de UI/estilos
- Routing
- Estado local

### Ambos (Full-Stack)
- Nuevos campos en modelos → backend + frontend
- Nuevos recursos API → backend + consumo en frontend

### Ejemplo: Agregar campo "prioridad" a tareas

1. **Backend:** `prisma/schema.prisma` → agregar campo `priority String`
2. **Backend:** `tasks/tasks.service.js` → incluir en responses
3. **Frontend:** `TaskDialog.jsx` → agregar selector de prioridad
4. **Frontend:** `TaskCard.jsx` → mostrar indicador visual

## Scripts de Ejecución

### Backend
```bash
cd task-manager-backend
npm run dev   # Puerto 3001
```

### Frontend
```bash
cd task-manager-frontend
npm run dev   # Puerto 3002
```

## Notas

- CORS habilitado para cualquier origen
- Swagger disponible en `http://localhost:3001/api-docs`
- Token se guarda en `localStorage` del frontend
- Estado global gestionado por `TaskContext`