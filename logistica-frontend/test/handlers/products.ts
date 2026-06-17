import { http, HttpResponse } from "msw"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1"

export const productsData = {
  list: [
    {
      id: 1,
      sku: "PROD-001",
      name: "Widget A",
      category: "Electrónica",
      unit_price: "25.50",
      stock_quantity: 100,
      is_active: true,
      supplier_name: "Proveedor A",
      warehouse_name: "Bodega Central",
    },
    {
      id: 2,
      sku: "PROD-002",
      name: "Widget B",
      category: null,
      unit_price: "10.00",
      stock_quantity: 50,
      is_active: false,
      supplier_name: null,
      warehouse_name: null,
    },
  ],
  detail: {
    id: 1,
    sku: "PROD-001",
    name: "Widget A",
    description: "Un widget de prueba",
    category: "Electrónica",
    unit_price: "25.50",
    supplier: 1,
    warehouse: 1,
    stock_quantity: 100,
    weight_kg: "1.5",
    dimensions: "10x10x10",
    is_active: true,
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-05-22T16:00:00Z",
  },
  bySku: {
    sku: "PROD-001",
    name: "Widget A",
    description: "Un widget de prueba",
    category: "Electrónica",
    unit_price: "25.50",
    supplier: 1,
    warehouse: 1,
    stock_quantity: 100,
    weight_kg: "1.5",
    dimensions: "10x10x10",
    is_active: true,
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-05-22T16:00:00Z",
  },
}

export const productsHandlers = [
  http.get(`${API_BASE}/products/`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get("page")) || 1
    const items = page === 1 ? productsData.list : []
    return HttpResponse.json({
      count: productsData.list.length,
      next: null,
      previous: null,
      results: items,
    })
  }),

  http.get(`${API_BASE}/products/by-sku/:sku/`, ({ params }) => {
    if (params.sku === "PROD-001") {
      return HttpResponse.json(productsData.bySku)
    }
    return HttpResponse.json({ detail: "Not found" }, { status: 404 })
  }),

  http.get(`${API_BASE}/products/:id/`, ({ params }) => {
    if (params.id === "1") {
      return HttpResponse.json(productsData.detail)
    }
    return HttpResponse.json({ detail: "Not found" }, { status: 404 })
  }),

  http.post(`${API_BASE}/products/`, async ({ request }) => {
    const body = (await request.json()) as { sku?: string; name?: string; unit_price?: string }
    if (!body.sku || !body.name || !body.unit_price) {
      return HttpResponse.json(
        { sku: ["Este campo es obligatorio."], name: ["Este campo es obligatorio."], unit_price: ["Este campo es obligatorio."] },
        { status: 400 },
      )
    }
    return HttpResponse.json({ id: 3, ...body }, { status: 201 })
  }),

  http.put(`${API_BASE}/products/:id/`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json({ id: Number(params.id), ...(body as object) })
  }),

  http.delete(`${API_BASE}/products/:id/`, () => {
    return HttpResponse.json(null, { status: 204 })
  }),
]
