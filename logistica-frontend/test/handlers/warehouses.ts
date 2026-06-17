import { http, HttpResponse } from "msw"

const API_BASE = "http://localhost:8000/api/v1"

export const warehousesData = {
  list: [
    {
      id: 1,
      name: "Bodega Central",
      code: "BC-001",
      city: "Santiago",
      is_active: true,
    },
    {
      id: 2,
      name: "Bodega Norte",
      code: "BN-002",
      city: "Antofagasta",
      is_active: false,
    },
  ],
  detail: {
    id: 1,
    name: "Bodega Central",
    code: "BC-001",
    address: "Av. Principal 123",
    city: "Santiago",
    country: "Chile",
    capacity: 5000,
    is_active: true,
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-05-20T14:30:00Z",
  },
}

export const warehousesHandlers = [
  http.get(`${API_BASE}/warehouses/`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get("page")) || 1
    const items = page === 1 ? warehousesData.list : []
    return HttpResponse.json({
      count: warehousesData.list.length,
      next: null,
      previous: null,
      results: items,
    })
  }),

  http.get(`${API_BASE}/warehouses/:id/`, ({ params }) => {
    if (params.id === "1") {
      return HttpResponse.json(warehousesData.detail)
    }
    return HttpResponse.json({ detail: "Not found" }, { status: 404 })
  }),

  http.post(`${API_BASE}/warehouses/`, async ({ request }) => {
    const body = (await request.json()) as { name?: string; code?: string }
    if (!body.name || !body.code) {
      return HttpResponse.json(
        { name: ["Este campo es obligatorio."], code: ["Este campo es obligatorio."] },
        { status: 400 },
      )
    }
    return HttpResponse.json({ id: 3, ...body }, { status: 201 })
  }),

  http.put(`${API_BASE}/warehouses/:id/`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json({ id: Number(params.id), ...(body as object) })
  }),

  http.delete(`${API_BASE}/warehouses/:id/`, () => {
    return HttpResponse.json(null, { status: 204 })
  }),
]
