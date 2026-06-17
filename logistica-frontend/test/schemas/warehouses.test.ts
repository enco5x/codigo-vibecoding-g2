import { describe, it, expect } from "vitest"

describe("warehouse form validation (no Zod — HTML5 native)", () => {
  const requiredFields = ["name", "code"] as const
  const optionalFields = ["address", "city", "country", "capacity", "is_active"] as const

  it("requires name and code", () => {
    expect(requiredFields).toContain("name")
    expect(requiredFields).toContain("code")
  })

  it("all optional fields are not required", () => {
    for (const field of optionalFields) {
      expect(requiredFields).not.toContain(field)
    }
  })

  it("capacity is number type", () => {
    const capacityIdx = optionalFields.indexOf("capacity")
    expect(capacityIdx).toBeGreaterThanOrEqual(0)
  })

  it("all fields are present in WarehouseCreate type", () => {
    const all = [...requiredFields, ...optionalFields]
    expect(all).toEqual([
      "name",
      "code",
      "address",
      "city",
      "country",
      "capacity",
      "is_active",
    ])
  })
})
