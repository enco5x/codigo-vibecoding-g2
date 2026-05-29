# SDD Workflow — Specification-Driven Development

## Principle

Build frontend features in 3 ordered phases:

```
1. SPEC  →  Define WHAT (endpoints, data shape, UI behavior)
2. IMPL  →  Build HOW (components, API calls, state)
3. VALID →  Verify it works (type check, lint, test)
```

Each feature passes through all 3 phases before moving to the next.

## Phase 1: Spec

Create a spec file in `docs/specs/{feature}.md` containing:

- **Endpoints used** (method, URL, request/response shape)
- **UI requirements** (list view, form fields, validation rules)
- **Navigation** (where it lives in the app, how users reach it)
- **State requirements** (loading, empty, error, success)

## Phase 2: Implementation

Build following the established conventions:

- **Page** → `app/{feature}/page.tsx` (route)
- **Components** → `components/{feature}/` (reusable pieces)
- **API client** → `lib/api/{feature}.ts` (fetch wrappers)
- **Types** → `lib/types/{feature}.ts` (TypeScript interfaces)

## Phase 3: Validation

- `npm run lint` — ESLint
- `npm run build` — TypeScript + compile
- Manual test: visit route, verify CRUD flow

## Frontend Architecture Rules

1. **No business logic in pages.** Pages orchestrate; components render; lib/api fetches.
2. **One file per concern.** `{entity}.list.tsx`, `{entity}.form.tsx`, `{entity}.detail.tsx`.
3. **Types mirror API.** Generate TypeScript interfaces from Django model spec.
4. **Centralized API client.** All HTTP calls through `lib/api/client.ts` (base URL, auth headers, error handling).
5. **Form validation** mirrors backend validation rules (required fields, field types, constraints).
