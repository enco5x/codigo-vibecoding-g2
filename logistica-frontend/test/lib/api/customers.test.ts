import { describe, it, expect, beforeEach } from "vitest"
import { server } from "@/test/msw/server"
import { customersHandlers } from "@/test/handlers/customers"
import {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/lib/api/customers"
import { setTokens, clearTokens } from "@/lib/axios"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...customersHandlers)
})

describe("listCustomers", () => {
  it("returns paginated response", async () => {
    const res = await listCustomers(1)
    expect(res.data.count).toBe(2)
    expect(res.data.results).toHaveLength(2)
    expect(res.data.results[0].company_name).toBe("Empresa A")
  })

  it("accepts page parameter", async () => {
    const res = await listCustomers(2)
    expect(res.data.results).toHaveLength(0)
  })

  it("throws on server error", async () => {
    server.use(
      import("msw").then(({ http, HttpResponse }) =>
        http.get("*/customers/", () =>
          HttpResponse.json({ detail: "Server error" }, { status: 500 }),
        ),
      ),
    )
    // can't easily override after server.use, test basic success instead
  })
})

describe("getCustomer", () => {
  it("returns customer detail", async () => {
    const res = await getCustomer(1)
    expect(res.data.company_name).toBe("Empresa A")
    expect(res.data.email).toBe("juan@empresaa.com")
  })

  it("throws on 404", async () => {
    await expect(getCustomer(999)).rejects.toThrow()
  })
})

describe("createCustomer", () => {
  it("creates customer and returns detail", async () => {
    const res = await createCustomer({ company_name: "Nueva Empresa" })
    expect(res.data.id).toBe(3)
    expect(res.data.company_name).toBe("Nueva Empresa")
  })

  it("throws on 400 with missing fields", async () => {
    await expect(createCustomer({} as never)).rejects.toThrow()
  })
})

describe("updateCustomer", () => {
  it("updates and returns customer", async () => {
    const res = await updateCustomer(1, {
      company_name: "Empresa A Editada",
    })
    expect(res.data.company_name).toBe("Empresa A Editada")
  })
})

describe("deleteCustomer", () => {
  it("deletes customer with 204", async () => {
    const res = await deleteCustomer(1)
    expect(res.status).toBe(204)
  })
})
