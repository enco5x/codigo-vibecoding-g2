import { http, HttpResponse } from "msw"

export const handlers = [
  http.post("*/auth/login/", async ({ request }) => {
    const body = (await request.json()) as { username: string; password: string }
    if (body.username === "admin" && body.password === "admin123") {
      return HttpResponse.json({
        access: "test-access-token",
        refresh: "test-refresh-token",
      })
    }
    return HttpResponse.json(
      { detail: "Usuario o contraseña incorrectos." },
      { status: 401 },
    )
  }),

  http.post("*/auth/logout/", () => {
    return HttpResponse.json({})
  }),

  http.post("*/auth/refresh/", async ({ request }) => {
    const body = (await request.json()) as { refresh: string }
    if (body.refresh === "test-refresh-token") {
      return HttpResponse.json({ access: "refreshed-access-token" })
    }
    return HttpResponse.json({ detail: "Token inválido" }, { status: 401 })
  }),

  http.get("*/auth/me/", () => {
    return HttpResponse.json({
      id: 1,
      username: "admin",
      email: "admin@test.com",
      first_name: "Admin",
      last_name: "User",
      is_active: true,
      is_superuser: true,
      is_staff: true,
      date_joined: "2026-01-01T00:00:00Z",
      groups: [],
      permissions: [],
    })
  }),
]
