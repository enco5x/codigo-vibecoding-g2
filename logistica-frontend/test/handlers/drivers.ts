import { http, HttpResponse } from "msw"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1"

export const driversData = {
  list: [
    {
      id: 1,
      license_number: "LIC-12345",
      phone: "+56 9 1111 1111",
      email: "conductor1@test.com",
      is_available: true,
    },
    {
      id: 2,
      license_number: "LIC-67890",
      phone: null,
      email: null,
      is_available: false,
    },
  ],
  detail: {
    id: 1,
    license_number: "LIC-12345",
    phone: "+56 9 1111 1111",
    email: "conductor1@test.com",
    is_available: true,
    created_at: "2026-03-10T07:00:00Z",
    updated_at: "2026-05-25T10:00:00Z",
  },
}

export const driversHandlers = [
  http.get(`${API_BASE}/drivers/`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get("page")) || 1
    const items = page === 1 ? driversData.list : []
    return HttpResponse.json({
      count: driversData.list.length,
      next: null,
      previous: null,
      results: items,
    })
  }),

  http.get(`${API_BASE}/drivers/:id/`, ({ params }) => {
    if (params.id === "1") {
      return HttpResponse.json(driversData.detail)
    }
    return HttpResponse.json({ detail: "Not found" }, { status: 404 })
  }),

  http.post(`${API_BASE}/drivers/`, async ({ request }) => {
    const body = (await request.json()) as { license_number?: string }
    if (!body.license_number) {
      return HttpResponse.json(
        { license_number: ["Este campo es obligatorio."] },
        { status: 400 },
      )
    }
    return HttpResponse.json({ id: 3, ...body }, { status: 201 })
  }),

  http.put(`${API_BASE}/drivers/:id/`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json({ id: Number(params.id), ...(body as object) })
  }),

  http.delete(`${API_BASE}/drivers/:id/`, () => {
    return HttpResponse.json(null, { status: 204 })
  }),
]
