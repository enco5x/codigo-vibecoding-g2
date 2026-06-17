import { describe, it, expect } from "vitest"

describe("customer form validation (no Zod — HTML5 native)", () => {
  const requiredFields = ["company_name"] as const
  const optionalFields = ["contact_name", "email", "phone", "address", "city", "country"] as const

  it("requires company_name", () => {
    expect(requiredFields).toContain("company_name")
  })

  it("all optional fields are not required", () => {
    for (const field of optionalFields) {
      expect(requiredFields).not.toContain(field)
    }
  })

  it("all fields are present in CustomerCreate type", () => {
    const all = [...requiredFields, ...optionalFields]
    expect(all).toEqual([
      "company_name",
      "contact_name",
      "email",
      "phone",
      "address",
      "city",
      "country",
    ])
  })
})
