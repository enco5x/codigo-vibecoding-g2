import { http, HttpResponse } from "msw"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"

export const transportsData = {
  list: [
    {
      id: 1,
      plate_number: "ABC-123",
      vehicle_type: "Camión",
      vehicle_model: "Volvo FH16",
      driver_name: "Juan Pérez",
      is_available: true,
    },
    {
      id: 2,
      plate_number: "XYZ-789",
      vehicle_type: null,
      vehicle_model: null,
      driver_name: null,
      is_available: false,
    },
  ],
  detail: {
    id: 1,
    plate_number: "ABC-123",
    vehicle_type: "Camión",
    vehicle_model: "Volvo FH16",
    capacity_kg: "20000",
    is_available: true,
    driver: 1,
    created_at: "2026-04-01T06:00:00Z",
    updated_at: "2026-05-26T08:00:00Z",
  },
}

export const transportsHandlers = [
  http.get(`${API_BASE}/transports/`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get("page")) || 1
    const items = page === 1 ? transportsData.list : []
    return HttpResponse.json({
      count: transportsData.list.length,
      next: null,
      previous: null,
      results: items,
    })
  }),

  http.get(`${API_BASE}/transports/:id/`, ({ params }) => {
    if (params.id === "1") {
      return HttpResponse.json(transportsData.detail)
    }
    return HttpResponse.json({ detail: "Not found" }, { status: 404 })
  }),

  http.post(`${API_BASE}/transports/`, async ({ request }) => {
    const body = (await request.json()) as { plate_number?: string }
    if (!body.plate_number) {
      return HttpResponse.json(
        { plate_number: ["Este campo es obligatorio."] },
        { status: 400 },
      )
    }
    return HttpResponse.json({ id: 3, ...body }, { status: 201 })
  }),

  http.put(`${API_BASE}/transports/:id/`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json({ id: Number(params.id), ...(body as object) })
  }),

  http.delete(`${API_BASE}/transports/:id/`, () => {
    return HttpResponse.json(null, { status: 204 })
  }),
]
