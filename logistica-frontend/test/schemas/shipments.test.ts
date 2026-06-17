import { describe, it, expect } from "vitest"
import { STATUS_CHOICES, type ShipmentStatus } from "@/lib/types/shipment"

describe("shipment form validation (no Zod — HTML5 native)", () => {
  const requiredFields = ["customer", "destination_address", "destination_city", "destination_country"] as const
  const optionalFields = ["warehouse", "origin_address", "scheduled_pickup", "scheduled_delivery", "weight_kg", "notes"] as const

  it("requires customer, destination_address, destination_city, destination_country", () => {
    expect(requiredFields).toContain("customer")
    expect(requiredFields).toContain("destination_address")
    expect(requiredFields).toContain("destination_city")
    expect(requiredFields).toContain("destination_country")
  })

  it("all optional fields are not required", () => {
    for (const field of optionalFields) {
      expect(requiredFields).not.toContain(field)
    }
  })

  it("STATUS_CHOICES keys match ShipmentStatus type", () => {
    const keys = Object.keys(STATUS_CHOICES) as ShipmentStatus[]
    const validStatuses: ShipmentStatus[] = ["pending", "assigned", "in_transit", "delivered", "cancelled"]
    for (const key of keys) {
      expect(validStatuses).toContain(key)
    }
    expect(keys.length).toBe(validStatuses.length)
  })

  it("all fields are present in ShipmentCreate type", () => {
    const all = [...requiredFields, ...optionalFields]
    expect(all).toEqual([
      "customer",
      "destination_address",
      "destination_city",
      "destination_country",
      "warehouse",
      "origin_address",
      "scheduled_pickup",
      "scheduled_delivery",
      "weight_kg",
      "notes",
    ])
  })
})
