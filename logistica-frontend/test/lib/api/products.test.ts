import { describe, it, expect, beforeEach } from "vitest"
import { server } from "@/test/msw/server"
import { productsHandlers } from "@/test/handlers/products"
import {
  listProducts,
  getProduct,
  getProductBySku,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/api/products"
import { setTokens, clearTokens } from "@/lib/api/client"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...productsHandlers)
})

describe("listProducts", () => {
  it("returns paginated response", async () => {
    const res = await listProducts(1)
    expect(res.data.count).toBe(2)
    expect(res.data.results).toHaveLength(2)
    expect(res.data.results[0].sku).toBe("PROD-001")
  })

  it("accepts page parameter", async () => {
    const res = await listProducts(2)
    expect(res.data.results).toHaveLength(0)
  })
})

describe("getProduct", () => {
  it("returns product detail", async () => {
    const res = await getProduct(1)
    expect(res.data.name).toBe("Widget A")
    expect(res.data.unit_price).toBe("25.50")
  })

  it("throws on 404", async () => {
    await expect(getProduct(999)).rejects.toThrow()
  })
})

describe("getProductBySku", () => {
  it("returns product by sku", async () => {
    const res = await getProductBySku("PROD-001")
    expect(res.data.name).toBe("Widget A")
  })

  it("throws on 404", async () => {
    await expect(getProductBySku("INVALID")).rejects.toThrow()
  })
})

describe("createProduct", () => {
  it("creates product and returns detail", async () => {
    const res = await createProduct({ sku: "PROD-003", name: "Widget C", unit_price: 30 })
    expect(res.data.id).toBe(3)
    expect(res.data.name).toBe("Widget C")
  })

  it("throws on 400 with missing fields", async () => {
    await expect(createProduct({} as never)).rejects.toThrow()
  })
})

describe("updateProduct", () => {
  it("updates and returns product", async () => {
    const res = await updateProduct(1, { sku: "PROD-001", name: "Widget Editado", unit_price: 35 })
    expect(res.data.name).toBe("Widget Editado")
  })
})

describe("deleteProduct", () => {
  it("deletes product with 204", async () => {
    const res = await deleteProduct(1)
    expect(res.status).toBe(204)
  })
})
