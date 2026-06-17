import { http, HttpResponse } from "msw"

const API_BASE = "http://localhost:8000/api/v1"

export const routesData = {
  list: [
    {
      id: 1,
      name: "Ruta Santiago",
      transport_id: 1,
      transport_plate: "ABC-123",
      status: "in_progress",
      estimated_start: "2026-06-05T08:00:00Z",
      estimated_end: "2026-06-05T18:00:00Z",
      created_at: "2026-06-04T10:00:00Z",
    },
    {
      id: 2,
      name: "Ruta Valparaíso",
      transport_id: null,
      transport_plate: null,
      status: "pending",
      estimated_start: null,
      estimated_end: null,
      created_at: "2026-06-04T11:00:00Z",
    },
  ],
  detail: {
    id: 1,
    name: "Ruta Santiago",
    transport: 1,
    transport_plate: "ABC-123",
    status: "in_progress",
    estimated_start: "2026-06-05T08:00:00Z",
    estimated_end: "2026-06-05T18:00:00Z",
    stops: [
      { id: 1, order: 1, address: "Parada 1", city: "Santiago", estimated_arrival: "2026-06-05T09:00:00Z", notes: null, status: "completed" },
      { id: 2, order: 2, address: "Parada 2", city: "Santiago", estimated_arrival: "2026-06-05T12:00:00Z", notes: "Con cuidado", status: "pending" },
    ],
    created_at: "2026-06-04T10:00:00Z",
    updated_at: "2026-06-05T08:00:00Z",
  },
}

export const routesHandlers = [
  http.get(`${API_BASE}/routes/`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get("page")) || 1
    const items = page === 1 ? routesData.list : []
    return HttpResponse.json({
      count: routesData.list.length,
      next: null,
      previous: null,
      results: items,
    })
  }),

  http.get(`${API_BASE}/routes/:id/`, ({ params }) => {
    if (params.id === "1") {
      return HttpResponse.json(routesData.detail)
    }
    return HttpResponse.json({ detail: "Not found" }, { status: 404 })
  }),

  http.post(`${API_BASE}/routes/`, async ({ request }) => {
    const body = (await request.json()) as { name?: string }
    if (!body.name) {
      return HttpResponse.json(
        { name: ["Este campo es obligatorio."] },
        { status: 400 },
      )
    }
    return HttpResponse.json({ id: 3, ...body }, { status: 201 })
  }),

  http.put(`${API_BASE}/routes/:id/`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json({ id: Number(params.id), ...(body as object) })
  }),

  http.delete(`${API_BASE}/routes/:id/`, () => {
    return HttpResponse.json(null, { status: 204 })
  }),

  http.post(`${API_BASE}/routes/:routeId/stops/`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 3, status: "pending", ...(body as object) }, { status: 201 })
  }),
]
