import { describe, it, expect, beforeEach } from "vitest"
import { server } from "@/test/msw/server"
import { shipmentsHandlers } from "@/test/handlers/shipments"
import {
  listShipments,
  getShipment,
  getShipmentByTracking,
  createShipment,
  updateShipment,
  updateShipmentStatus,
  addShipmentItem,
  deleteShipment,
} from "@/lib/api/shipments"
import { setTokens, clearTokens } from "@/lib/api/client"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...shipmentsHandlers)
})

describe("listShipments", () => {
  it("returns paginated response", async () => {
    const res = await listShipments(1)
    expect(res.data.count).toBe(2)
    expect(res.data.results).toHaveLength(2)
    expect(res.data.results[0].tracking_number).toBe("TRK-001")
  })

  it("accepts page parameter", async () => {
    const res = await listShipments(2)
    expect(res.data.results).toHaveLength(0)
  })
})

describe("getShipment", () => {
  it("returns shipment detail", async () => {
    const res = await getShipment(1)
    expect(res.data.tracking_number).toBe("TRK-001")
    expect(res.data.customer.company_name).toBe("Empresa A")
  })

  it("throws on 404", async () => {
    await expect(getShipment(999)).rejects.toThrow()
  })
})

describe("getShipmentByTracking", () => {
  it("returns shipment by tracking number", async () => {
    const res = await getShipmentByTracking("TRK-001")
    expect(res.data.tracking_number).toBe("TRK-001")
  })

  it("throws on 404", async () => {
    await expect(getShipmentByTracking("INVALID")).rejects.toThrow()
  })
})

describe("createShipment", () => {
  it("creates shipment and returns detail", async () => {
    const res = await createShipment({
      customer: 1,
      destination_address: "Av. Destino 789",
      destination_city: "Viña del Mar",
      destination_country: "Chile",
    })
    expect(res.data.id).toBe(3)
    expect(res.data.tracking_number).toBe("TRK-003")
  })
})

describe("updateShipment", () => {
  it("updates and returns shipment", async () => {
    const res = await updateShipment(1, {
      customer: 1,
      destination_address: "Av. Destino 456",
      destination_city: "Santiago",
      destination_country: "Chile",
    })
    expect(res.data.destination_city).toBe("Santiago")
  })
})

describe("updateShipmentStatus", () => {
  it("updates status and returns shipment", async () => {
    const res = await updateShipmentStatus(1, "delivered")
    expect(res.data.status).toBe("delivered")
  })
})

describe("addShipmentItem", () => {
  it("adds item and returns detail", async () => {
    const res = await addShipmentItem(1, { product: 2, quantity: 5, unit_price: "10.00" })
    expect(res.data.id).toBe(2)
  })
})

describe("deleteShipment", () => {
  it("deletes shipment with 204", async () => {
    const res = await deleteShipment(1)
    expect(res.status).toBe(204)
  })
})
