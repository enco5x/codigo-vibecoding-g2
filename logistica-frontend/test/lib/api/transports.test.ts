import { describe, it, expect, beforeEach } from "vitest"
import { server } from "@/test/msw/server"
import { transportsHandlers } from "@/test/handlers/transports"
import {
  listTransports,
  getTransport,
  createTransport,
  updateTransport,
  deleteTransport,
} from "@/lib/api/transports"
import { setTokens, clearTokens } from "@/lib/axios"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...transportsHandlers)
})

describe("listTransports", () => {
  it("returns paginated response", async () => {
    const res = await listTransports(1)
    expect(res.data.count).toBe(2)
    expect(res.data.results).toHaveLength(2)
    expect(res.data.results[0].plate_number).toBe("ABC-123")
  })

  it("accepts page parameter", async () => {
    const res = await listTransports(2)
    expect(res.data.results).toHaveLength(0)
  })
})

describe("getTransport", () => {
  it("returns transport detail", async () => {
    const res = await getTransport(1)
    expect(res.data.plate_number).toBe("ABC-123")
    expect(res.data.vehicle_type).toBe("Camión")
  })

  it("throws on 404", async () => {
    await expect(getTransport(999)).rejects.toThrow()
  })
})

describe("createTransport", () => {
  it("creates transport and returns detail", async () => {
    const res = await createTransport({ plate_number: "DEF-456" })
    expect(res.data.id).toBe(3)
    expect(res.data.plate_number).toBe("DEF-456")
  })

  it("throws on 400 with missing fields", async () => {
    await expect(createTransport({} as never)).rejects.toThrow()
  })
})

describe("updateTransport", () => {
  it("updates and returns transport", async () => {
    const res = await updateTransport(1, { plate_number: "ABC-123" })
    expect(res.data.plate_number).toBe("ABC-123")
  })
})

describe("deleteTransport", () => {
  it("deletes transport with 204", async () => {
    const res = await deleteTransport(1)
    expect(res.status).toBe(204)
  })
})
