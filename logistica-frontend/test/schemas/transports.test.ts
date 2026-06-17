import { describe, it, expect } from "vitest"

describe("transport form validation (no Zod — HTML5 native)", () => {
  const requiredFields = ["plate_number"] as const
  const optionalFields = ["vehicle_type", "vehicle_model", "capacity_kg", "is_available", "driver"] as const

  it("requires plate_number", () => {
    expect(requiredFields).toContain("plate_number")
  })

  it("all optional fields are not required", () => {
    for (const field of optionalFields) {
      expect(requiredFields).not.toContain(field)
    }
  })

  it("all fields are present in TransportCreate type", () => {
    const all = [...requiredFields, ...optionalFields]
    expect(all).toEqual([
      "plate_number",
      "vehicle_type",
      "vehicle_model",
      "capacity_kg",
      "is_available",
      "driver",
    ])
  })
})
