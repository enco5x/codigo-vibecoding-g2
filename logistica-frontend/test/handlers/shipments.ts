import { http, HttpResponse } from "msw"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1"

export const shipmentsData = {
  list: [
    {
      id: 1,
      tracking_number: "TRK-001",
      customer_name: "Empresa A",
      status: "in_transit",
      status_display: "En tránsito",
      destination_city: "Santiago",
      scheduled_delivery: "2026-06-10T00:00:00Z",
      shipping_cost: "150.00",
      created_at: "2026-06-01T10:00:00Z",
    },
    {
      id: 2,
      tracking_number: "TRK-002",
      customer_name: "Empresa B",
      status: "pending",
      status_display: "Pendiente",
      destination_city: "Valparaíso",
      scheduled_delivery: null,
      shipping_cost: "200.00",
      created_at: "2026-06-02T10:00:00Z",
    },
  ],
  detail: {
    id: 1,
    tracking_number: "TRK-001",
    customer: { id: 1, company_name: "Empresa A" },
    warehouse: { id: 1, name: "Bodega Central", code: "BC-001" },
    origin_address: "Av. Origen 123",
    destination_address: "Av. Destino 456",
    destination_city: "Santiago",
    destination_country: "Chile",
    scheduled_pickup: "2026-06-05T08:00:00Z",
    scheduled_delivery: "2026-06-10T00:00:00Z",
    weight_kg: "100",
    shipping_cost: "150.00",
    notes: "Entregar en bodega",
    status: "in_transit",
    status_display: "En tránsito",
    items: [
      { id: 1, product: 1, product_name: "Widget A", quantity: 10, unit_price: "25.50" },
    ],
    created_at: "2026-06-01T10:00:00Z",
    updated_at: "2026-06-03T12:00:00Z",
  },
}

export const shipmentsHandlers = [
  http.get(`${API_BASE}/shipments/`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get("page")) || 1
    const items = page === 1 ? shipmentsData.list : []
    return HttpResponse.json({
      count: shipmentsData.list.length,
      next: null,
      previous: null,
      results: items,
    })
  }),

  http.get(`${API_BASE}/shipments/tracking/:tn/`, ({ params }) => {
    if (params.tn === "TRK-001") {
      return HttpResponse.json(shipmentsData.detail)
    }
    return HttpResponse.json({ detail: "Not found" }, { status: 404 })
  }),

  http.get(`${API_BASE}/shipments/:id/`, ({ params }) => {
    if (params.id === "1") {
      return HttpResponse.json(shipmentsData.detail)
    }
    return HttpResponse.json({ detail: "Not found" }, { status: 404 })
  }),

  http.post(`${API_BASE}/shipments/`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 3, ...(body as object), tracking_number: "TRK-003" }, { status: 201 })
  }),

  http.put(`${API_BASE}/shipments/:id/`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json({ id: Number(params.id), ...(body as object) })
  }),

  http.patch(`${API_BASE}/shipments/:id/status/`, async ({ request, params }) => {
    const body = (await request.json()) as { status?: string }
    return HttpResponse.json({
      ...shipmentsData.detail,
      id: Number(params.id),
      status: body.status ?? shipmentsData.detail.status,
      status_display: body.status === "delivered" ? "Entregado" : shipmentsData.detail.status_display,
    })
  }),

  http.post(`${API_BASE}/shipments/:shipmentId/items/`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 2, product: 2, product_name: "Widget B", ...(body as object) }, { status: 201 })
  }),

  http.delete(`${API_BASE}/shipments/:id/`, () => {
    return HttpResponse.json(null, { status: 204 })
  }),
]
