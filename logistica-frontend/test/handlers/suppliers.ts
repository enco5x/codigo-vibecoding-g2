import { http, HttpResponse } from "msw"

const API_BASE = "http://localhost:8000/api/v1"

export const suppliersData = {
  list: [
    {
      id: 1,
      company_name: "Proveedor A",
      contact_name: "Pedro Martínez",
      email: "pedro@proveedora.com",
      city: "Santiago",
    },
    {
      id: 2,
      company_name: "Proveedor B",
      contact_name: null,
      email: null,
      city: null,
    },
  ],
  detail: {
    id: 1,
    company_name: "Proveedor A",
    contact_name: "Pedro Martínez",
    email: "pedro@proveedora.com",
    phone: "+56 9 8765 4321",
    address: "Calle Secundaria 456",
    city: "Santiago",
    country: "Chile",
    created_at: "2026-02-10T08:00:00Z",
    updated_at: "2026-05-18T12:00:00Z",
  },
}

export const suppliersHandlers = [
  http.get(`${API_BASE}/suppliers/`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get("page")) || 1
    const items = page === 1 ? suppliersData.list : []
    return HttpResponse.json({
      count: suppliersData.list.length,
      next: null,
      previous: null,
      results: items,
    })
  }),

  http.get(`${API_BASE}/suppliers/:id/`, ({ params }) => {
    if (params.id === "1") {
      return HttpResponse.json(suppliersData.detail)
    }
    return HttpResponse.json({ detail: "Not found" }, { status: 404 })
  }),

  http.post(`${API_BASE}/suppliers/`, async ({ request }) => {
    const body = (await request.json()) as { company_name?: string }
    if (!body.company_name) {
      return HttpResponse.json(
        { company_name: ["Este campo es obligatorio."] },
        { status: 400 },
      )
    }
    return HttpResponse.json({ id: 3, ...body }, { status: 201 })
  }),

  http.put(`${API_BASE}/suppliers/:id/`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json({ id: Number(params.id), ...(body as object) })
  }),

  http.delete(`${API_BASE}/suppliers/:id/`, () => {
    return HttpResponse.json(null, { status: 204 })
  }),
]
