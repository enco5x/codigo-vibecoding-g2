import { describe, it, expect, beforeEach } from "vitest"
import { server } from "@/test/msw/server"
import { routesHandlers } from "@/test/handlers/routes"
import {
  listRoutes,
  getRoute,
  createRoute,
  updateRoute,
  deleteRoute,
  addRouteStop,
} from "@/lib/api/routes"
import { setTokens, clearTokens } from "@/lib/axios"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...routesHandlers)
})

describe("listRoutes", () => {
  it("returns paginated response", async () => {
    const res = await listRoutes(1)
    expect(res.data.count).toBe(2)
    expect(res.data.results).toHaveLength(2)
    expect(res.data.results[0].name).toBe("Ruta Santiago")
  })

  it("accepts page parameter", async () => {
    const res = await listRoutes(2)
    expect(res.data.results).toHaveLength(0)
  })
})

describe("getRoute", () => {
  it("returns route detail", async () => {
    const res = await getRoute(1)
    expect(res.data.name).toBe("Ruta Santiago")
    expect(res.data.stops).toHaveLength(2)
  })

  it("throws on 404", async () => {
    await expect(getRoute(999)).rejects.toThrow()
  })
})

describe("createRoute", () => {
  it("creates route and returns detail", async () => {
    const res = await createRoute({ name: "Ruta Nueva" })
    expect(res.data.id).toBe(3)
    expect(res.data.name).toBe("Ruta Nueva")
  })

  it("throws on 400 with missing fields", async () => {
    await expect(createRoute({} as never)).rejects.toThrow()
  })
})

describe("updateRoute", () => {
  it("updates and returns route", async () => {
    const res = await updateRoute(1, { name: "Ruta Editada" })
    expect(res.data.name).toBe("Ruta Editada")
  })
})

describe("deleteRoute", () => {
  it("deletes route with 204", async () => {
    const res = await deleteRoute(1)
    expect(res.status).toBe(204)
  })
})

describe("addRouteStop", () => {
  it("adds stop and returns detail", async () => {
    const res = await addRouteStop(1, { order: 3, address: "Parada 3", city: "Santiago" })
    expect(res.data.id).toBe(3)
  })
})
