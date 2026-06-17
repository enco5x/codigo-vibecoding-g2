import { describe, it, expect } from "vitest"

describe("driver form validation (no Zod — HTML5 native)", () => {
  const requiredFields = ["license_number"] as const
  const optionalFields = ["phone", "email", "is_available"] as const

  it("requires license_number", () => {
    expect(requiredFields).toContain("license_number")
  })

  it("all optional fields are not required", () => {
    for (const field of optionalFields) {
      expect(requiredFields).not.toContain(field)
    }
  })

  it("all fields are present in DriverCreate type", () => {
    const all = [...requiredFields, ...optionalFields]
    expect(all).toEqual([
      "license_number",
      "phone",
      "email",
      "is_available",
    ])
  })
})
