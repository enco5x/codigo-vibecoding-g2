import { describe, it, expect, beforeEach } from "vitest"
import { server } from "@/test/msw/server"
import { driversHandlers } from "@/test/handlers/drivers"
import {
  listDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
} from "@/lib/api/drivers"
import { setTokens, clearTokens } from "@/lib/axios"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...driversHandlers)
})

describe("listDrivers", () => {
  it("returns paginated response", async () => {
    const res = await listDrivers(1)
    expect(res.data.count).toBe(2)
    expect(res.data.results).toHaveLength(2)
    expect(res.data.results[0].license_number).toBe("LIC-12345")
  })

  it("accepts page parameter", async () => {
    const res = await listDrivers(2)
    expect(res.data.results).toHaveLength(0)
  })
})

describe("getDriver", () => {
  it("returns driver detail", async () => {
    const res = await getDriver(1)
    expect(res.data.license_number).toBe("LIC-12345")
    expect(res.data.email).toBe("conductor1@test.com")
  })

  it("throws on 404", async () => {
    await expect(getDriver(999)).rejects.toThrow()
  })
})

describe("createDriver", () => {
  it("creates driver and returns detail", async () => {
    const res = await createDriver({ license_number: "LIC-99999" })
    expect(res.data.id).toBe(3)
    expect(res.data.license_number).toBe("LIC-99999")
  })

  it("throws on 400 with missing fields", async () => {
    await expect(createDriver({} as never)).rejects.toThrow()
  })
})

describe("updateDriver", () => {
  it("updates and returns driver", async () => {
    const res = await updateDriver(1, { license_number: "LIC-12345" })
    expect(res.data.license_number).toBe("LIC-12345")
  })
})

describe("deleteDriver", () => {
  it("deletes driver with 204", async () => {
    const res = await deleteDriver(1)
    expect(res.status).toBe(204)
  })
})
