import { describe, it, expect, beforeEach } from "vitest"
import { server } from "@/test/msw/server"
import { warehousesHandlers } from "@/test/handlers/warehouses"
import {
  listWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "@/lib/api/warehouses"
import { setTokens, clearTokens } from "@/lib/axios"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...warehousesHandlers)
})

describe("listWarehouses", () => {
  it("returns paginated response", async () => {
    const res = await listWarehouses(1)
    expect(res.data.count).toBe(2)
    expect(res.data.results).toHaveLength(2)
    expect(res.data.results[0].name).toBe("Bodega Central")
  })

  it("accepts page parameter", async () => {
    const res = await listWarehouses(2)
    expect(res.data.results).toHaveLength(0)
  })
})

describe("getWarehouse", () => {
  it("returns warehouse detail", async () => {
    const res = await getWarehouse(1)
    expect(res.data.name).toBe("Bodega Central")
    expect(res.data.code).toBe("BC-001")
  })

  it("throws on 404", async () => {
    await expect(getWarehouse(999)).rejects.toThrow()
  })
})

describe("createWarehouse", () => {
  it("creates warehouse and returns detail", async () => {
    const res = await createWarehouse({ name: "Bodega Nueva", code: "BN-003" })
    expect(res.data.id).toBe(3)
    expect(res.data.name).toBe("Bodega Nueva")
  })

  it("throws on 400 with missing fields", async () => {
    await expect(createWarehouse({} as never)).rejects.toThrow()
  })
})

describe("updateWarehouse", () => {
  it("updates and returns warehouse", async () => {
    const res = await updateWarehouse(1, { name: "Bodega Editada", code: "BC-001" })
    expect(res.data.name).toBe("Bodega Editada")
  })
})

describe("deleteWarehouse", () => {
  it("deletes warehouse with 204", async () => {
    const res = await deleteWarehouse(1)
    expect(res.status).toBe(204)
  })
})
