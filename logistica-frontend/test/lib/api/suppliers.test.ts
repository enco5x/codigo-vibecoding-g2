import { describe, it, expect, beforeEach } from "vitest"
import { server } from "@/test/msw/server"
import { suppliersHandlers } from "@/test/handlers/suppliers"
import {
  listSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/lib/api/suppliers"
import { setTokens, clearTokens } from "@/lib/api/client"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...suppliersHandlers)
})

describe("listSuppliers", () => {
  it("returns paginated response", async () => {
    const res = await listSuppliers(1)
    expect(res.data.count).toBe(2)
    expect(res.data.results).toHaveLength(2)
    expect(res.data.results[0].company_name).toBe("Proveedor A")
  })

  it("accepts page parameter", async () => {
    const res = await listSuppliers(2)
    expect(res.data.results).toHaveLength(0)
  })
})

describe("getSupplier", () => {
  it("returns supplier detail", async () => {
    const res = await getSupplier(1)
    expect(res.data.company_name).toBe("Proveedor A")
    expect(res.data.email).toBe("pedro@proveedora.com")
  })

  it("throws on 404", async () => {
    await expect(getSupplier(999)).rejects.toThrow()
  })
})

describe("createSupplier", () => {
  it("creates supplier and returns detail", async () => {
    const res = await createSupplier({ company_name: "Nuevo Proveedor" })
    expect(res.data.id).toBe(3)
    expect(res.data.company_name).toBe("Nuevo Proveedor")
  })

  it("throws on 400 with missing fields", async () => {
    await expect(createSupplier({} as never)).rejects.toThrow()
  })
})

describe("updateSupplier", () => {
  it("updates and returns supplier", async () => {
    const res = await updateSupplier(1, { company_name: "Proveedor Editado" })
    expect(res.data.company_name).toBe("Proveedor Editado")
  })
})

describe("deleteSupplier", () => {
  it("deletes supplier with 204", async () => {
    const res = await deleteSupplier(1)
    expect(res.status).toBe(204)
  })
})
