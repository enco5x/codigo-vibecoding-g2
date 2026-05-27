# SDD Workflow — logistica-api

## Overview

Este proyecto usa **Spec Driven Development (SDD)** con 4 agentes especializados. El flujo garantiza que cada módulo se analice, implemente y valide siguiendo la arquitectura y esquema de base de datos definidos en `docs/`.

## Roles

| Agente | Archivo | Rol | Escribe código? |
|--------|---------|-----|-----------------|
| **Orquestador** | `.opencode/agents/orquestador.md` | Entry point. Recibe el prompt del desarrollador y delega al agente correcto según la fase del flujo. | No |
| **Spec** | `.opencode/agents/spec-agent.md` | Lee `docs/architecture.md` y `docs/database-schema.md`, analiza requerimientos y genera tareas detalladas por módulo en `spec/`. | No (crea md) |
| **Implement** | `.opencode/agents/implement-agent.md` | Lee las tareas en `spec/<module>.md` y escribe el código Django correspondiente. | Sí |
| **Validator** | `.opencode/agents/validator-agent.md` | Revisa el código implementado contra las tareas, la arquitectura y el schema. Reporta errores en `validator-errors.md`. | No (crea md) |

## Flujo

```
Usuario prompt → Orquestador → Spec → Human Review → Implement → Validator → (loop si errores)
```

### Fase 1: Spec

El Orquestador invoca al agente Spec. Este:
1. Lee `docs/architecture.md` y `docs/database-schema.md`
2. Para cada módulo (`customer`, `warehouse`, `supplier`, `products`, `driver`, `transport`, `route`, `shipment`) crea `spec/<module>.md`
3. Cada archivo contiene tareas exactas: models, serializers, views, urls, services, admin, permissions

### Fase 2: Human Review

Entre Spec e Implement, el desarrollador revisa los archivos creados en `spec/`. Puede:

- **Aprobar** → el flujo continúa a Implement
- **Sugerir mejoras** → el Spec agent modifica los archivos y vuelve a presentar
- **Rechazar** → el Spec agent regenera desde cero

No se puede pasar a Implement sin aprobación humana explícita.

### Fase 3: Implement

El Orquestador invoca al agente Implement. Este:
1. Lee el archivo `spec/<module>.md` correspondiente
2. Crea o actualiza el código en la app Django siguiendo el patrón de arquitectura
3. Respeta el esquema de base de datos exactamente como está definido
4. Sigue buenas prácticas Django/Python

### Fase 4: Validation

El Orquestador invoca al agente Validator. Este:
1. Lee el código generado y lo compara contra `spec/<module>.md`, `docs/architecture.md` y `docs/database-schema.md`
2. Si encuentra errores → crea `validator-errors.md` en la raíz del proyecto con la lista de problemas
3. Si todo ok → responde con un mensaje de confirmación

### Loop

Si Validator reporta errores, el Orquestador vuelve a invocar a Implement con los errores como contexto. El ciclo se repite hasta que Validator confirme.

## Referencias

- [Architecture](architecture.md)
- [Database Schema](database-schema.md)
- [Orquestador](../.opencode/agents/orquestador.md)
- [Spec Agent](../.opencode/agents/spec-agent.md)
- [Implement Agent](../.opencode/agents/implement-agent.md)
- [Validator Agent](../.opencode/agents/validator-agent.md)
