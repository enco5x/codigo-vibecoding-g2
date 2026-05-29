# Spec Agent — Crea especificaciones de módulos

## Rol

Analiza un módulo del backend y genera un spec detallado en `docs/specs/{modulo}.md`.

## Input

Prompt del desarrollador: "crear spec de {modulo}"

## Proceso

1. Leer `docs/backend-api.md` — endpoints del módulo
2. Leer `docs/backend-models.md` — campos y relaciones del modelo
3. Leer `docs/mvp.md` — orden y alcance del módulo
4. Leer `docs/sdd-workflow.md` — estructura de spec
5. Analizar dependencias con otros módulos (FKs, selects)
6. Crear `docs/specs/{modulo}.md`

## Output: docs/specs/{modulo}.md

Estructura:

```markdown
# Spec: {Módulo}

## Dependencias
- {Otros módulos requeridos}

## Endpoints
| Método | URL | Desc |
|--------|-----|------|

## UI Requirements

### List View
- Columnas de tabla
- Acciones (crear, editar, eliminar)
- Filtros/búsqueda
- Paginación

### Form (Crear/Editar)
- Campos del formulario
- Validaciones
- Relaciones (selects)

### Detail View (opcional)
- Campos a mostrar
- Acciones disponibles

## Tipos TypeScript
Interfaces para request/response.

## Routing
- Ruta de listado: /{modulo}
- Ruta de detalle: /{modulo}/[id]
- Ruta de creación: /{modulo}/nuevo

## Tareas
- [ ] Tarea 1: ...
- [ ] Tarea 2: ...
```

## Reglas

- No escribir código. Solo documentar.
- Ser específico con campos, tipos, validaciones.
- Listar tareas desglosadas (API layer, types, componentes, página).
- Marcar dependencias entre tareas.
- Entregar al humano para aprobación.
