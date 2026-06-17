import { http, HttpResponse } from "msw"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1"

export const usersData = {
  list: [
    {
      id: 1,
      username: "admin",
      email: "admin@test.com",
      first_name: "Admin",
      last_name: "User",
      is_active: true,
      is_superuser: true,
      is_staff: true,
      date_joined: "2026-01-01T00:00:00Z",
      groups: ["admin"],
      permissions: ["all"],
    },
    {
      id: 2,
      username: "user1",
      email: "user1@test.com",
      first_name: "",
      last_name: "",
      is_active: true,
      is_superuser: false,
      is_staff: false,
      date_joined: "2026-02-01T00:00:00Z",
      groups: [],
      permissions: [],
    },
  ],
  detail: {
    id: 1,
    username: "admin",
    email: "admin@test.com",
    first_name: "Admin",
    last_name: "User",
    is_active: true,
    is_superuser: true,
    is_staff: true,
    date_joined: "2026-01-01T00:00:00Z",
    groups: ["admin"],
    permissions: ["all"],
  },
  groups: [
    { id: 1, name: "admin", permissions: [1, 2, 3] },
    { id: 2, name: "operators", permissions: [1, 2] },
  ],
  permissions: [
    { id: 1, codename: "view_warehouse", name: "Can view warehouse", content_type: "warehouse" },
    { id: 2, codename: "change_warehouse", name: "Can change warehouse", content_type: "warehouse" },
  ],
}

export const usersHandlers = [
  http.get(`${API_BASE}/auth/users/`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get("page")) || 1
    const items = page === 1 ? usersData.list : []
    return HttpResponse.json({
      count: usersData.list.length,
      next: null,
      previous: null,
      results: items,
    })
  }),

  http.get(`${API_BASE}/auth/users/:id/`, ({ params }) => {
    if (params.id === "1") {
      return HttpResponse.json(usersData.detail)
    }
    return HttpResponse.json({ detail: "Not found" }, { status: 404 })
  }),

  http.post(`${API_BASE}/auth/users/`, async ({ request }) => {
    const body = (await request.json()) as { username?: string; password?: string }
    if (!body.username || !body.password) {
      return HttpResponse.json(
        { username: ["Este campo es obligatorio."], password: ["Este campo es obligatorio."] },
        { status: 400 },
      )
    }
    return HttpResponse.json({ id: 3, ...body, email: "", first_name: "", last_name: "", is_active: true, is_superuser: false, is_staff: false, date_joined: "2026-06-04T00:00:00Z", groups: [], permissions: [] })
  }),

  http.patch(`${API_BASE}/auth/users/:id/`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json({ ...usersData.detail, ...(body as object), id: Number(params.id) })
  }),

  http.delete(`${API_BASE}/auth/users/:id/`, () => {
    return HttpResponse.json(null, { status: 204 })
  }),

  http.get(`${API_BASE}/auth/groups/`, () => {
    return HttpResponse.json(usersData.groups)
  }),

  http.get(`${API_BASE}/auth/groups/:id/`, ({ params }) => {
    const group = usersData.groups.find((g) => g.id === Number(params.id))
    if (group) {
      return HttpResponse.json(group)
    }
    return HttpResponse.json({ detail: "Not found" }, { status: 404 })
  }),

  http.post(`${API_BASE}/auth/groups/`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 3, ...(body as object) })
  }),

  http.patch(`${API_BASE}/auth/groups/:id/`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json({ id: Number(params.id), ...(body as object) })
  }),

  http.delete(`${API_BASE}/auth/groups/:id/`, () => {
    return HttpResponse.json(null, { status: 204 })
  }),

  http.get(`${API_BASE}/auth/permissions/`, () => {
    return HttpResponse.json(usersData.permissions)
  }),
]
