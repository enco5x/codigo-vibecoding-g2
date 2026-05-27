# AGENTS.md - logistica-api

## Reglas del Proyecto

- **Documentación y comunicación**: Español
- **Código, carpetas, tablas, columnas, desarrollo**: Inglés
- **Entorno virtual**: Siempre activar `.venv` antes de ejecutar cualquier comando
- **Runserver**: Ejecutar manualmente (`python manage.py runserver`) - el agente no debe correr este comando
- **Desarrollo**: Antes de cualquier tarea, consultar [docs/architecture.md](docs/architecture.md) para seguir el patrón de arquitectura (models, serializers, views, services)

---

## Base de Datos

**Referencia:** [docs/database-schema.md](docs/database-schema.md)

Siempre consultar el schema antes de crear modelos, migraciones o做任何操作 de base de datos. El schema define:

- 10 tablas personalizadas (customer, warehouse, supplier, product, driver, transport, route, route_stop, shipment, shipment_item)
- Relaciones entre modelos
- Tipos de datos y constraints
- Tablas de Django existentes (auth_user, etc.)

## Arquitectura

**Referencia:** [docs/architecture.md](docs/architecture.md)

Arquitectura de desarrollo MVP:

- Estructura de apps Django (por dominio)
- Patrón de arquitectura (models, serializers, views, services)
- Endpoints API REST
- Autenticación JWT y permisos por rol
- Mejores prácticas para modelos y serializers
- Fases de desarrollo recomendadas
- Dependencias del proyecto

---

## Proyecto

Django 6.0.5 REST API con Django REST Framework. SQLite para desarrollo local.

### Contexto

API REST Full para gestión de logística y envíos. Desarrollo por fases.

### Alcance (Módulos)

| Módulo | Descripción |
|--------|-------------|
| `customer` | Cliente - empresa o persona que genera envíos |
| `shipment` | Envío - unidad central de negocio (origen, destino, estado, fecha entrega, costo) |
| `products` | Productos de tecnología a enviar |
| `transport` | Medio de entrega al cliente |
| `driver` | Persona asignada al transporte |
| `route` | Secuencia de paradas del transporte |
| `warehouse` | Punto de partida y almacenamiento de productos |
| `suppliers` | Empresas que proveen los productos |

## Ejecución

```bash
cd C:\Users\Enco5\Dev\codigo-vibecoding-g2\logistica-api
.venv\Scripts\python.exe manage.py runserver
```

Servidor corre en `http://127.0.0.1:8000/`

## Comandos Django

```bash
# Migrar
python manage.py makemigrations
python manage.py migrate

# Crear app
python manage.py startapp <appname>

# Shell
python manage.py shell

# Admin
python manage.py createsuperuser
```

## Estructura

- `config/` - Configuración del proyecto Django
- `docs/` - Documentación del proyecto
- `products/` - App (esqueleto vacío)
- `db.sqlite3` - Base de datos SQLite local

## SDD Workflow

Este proyecto usa **Spec Driven Development (SDD)** con 4 agentes especializados.

Siempre iniciar cualquier tarea invocando al **Orquestador** (`.opencode/agents/orquestador.md`).

### Agentes

| # | Agente | Archivo | Rol |
|---|--------|---------|-----|
| 1 | **Orquestador** | `.opencode/agents/orquestador.md` | Entry point. Recibe prompt y delega al agente correcto |
| 2 | **Spec** | `.opencode/agents/spec-agent.md` | Analiza reqs, crea tareas detalladas en `spec/` |
| 3 | **Implement** | `.opencode/agents/implement-agent.md` | Lee tareas y escribe código Django |
| 4 | **Validator** | `.opencode/agents/validator-agent.md` | Revisa código vs spec + docs. Reporta errores si hay |

### Flujo

```
Orquestador → Spec → Human Review → Implement → Validator → (loop si errores)
```

Ver `docs/sdd-workflow.md` para detalle completo.

## Notas

- `SECRET_KEY` hardcodeado en `config/settings.py` (cambiar para producción)
- `DEBUG = True` - desactivar para producción
- `ALLOWED_HOSTS = []` - agregar dominio para producción
- No hay apps personalizadas en `INSTALLED_APPS` además de las de Django por defecto

