import { http, HttpResponse } from "msw"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"

export const customersData = {
  list: [
    {
      id: 1,
      company_name: "Empresa A",
      contact_name: "Juan Pérez",
      email: "juan@empresaa.com",
      city: "Santiago",
    },
    {
      id: 2,
      company_name: "Empresa B",
      contact_name: "María López",
      email: "maria@empresab.com",
      city: "Valparaíso",
    },
  ],
  detail: {
    id: 1,
    company_name: "Empresa A",
    contact_name: "Juan Pérez",
    email: "juan@empresaa.com",
    phone: "+56 9 1234 5678",
    address: "Calle Principal 123",
    city: "Santiago",
    country: "Chile",
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-05-20T14:30:00Z",
  },
}

export const customersHandlers = [
  http.get(`${API_BASE}/customers/`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get("page")) || 1
    const items = page === 1 ? customersData.list : []
    return HttpResponse.json({
      count: customersData.list.length,
      next: null,
      previous: null,
      results: items,
    })
  }),

  http.get(`${API_BASE}/customers/:id/`, ({ params }) => {
    if (params.id === "1") {
      return HttpResponse.json(customersData.detail)
    }
    return HttpResponse.json({ detail: "Not found" }, { status: 404 })
  }),

  http.post(`${API_BASE}/customers/`, async ({ request }) => {
    const body = (await request.json()) as { company_name?: string }
    if (!body.company_name) {
      return HttpResponse.json(
        { company_name: ["Este campo es obligatorio."] },
        { status: 400 },
      )
    }
    return HttpResponse.json({ id: 3, ...body }, { status: 201 })
  }),

  http.put(`${API_BASE}/customers/:id/`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json({ id: Number(params.id), ...(body as object) })
  }),

  http.delete(`${API_BASE}/customers/:id/`, () => {
    return HttpResponse.json(null, { status: 204 })
  }),
]
