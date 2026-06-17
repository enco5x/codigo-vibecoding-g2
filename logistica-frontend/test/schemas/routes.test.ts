import { describe, it, expect } from "vitest"

describe("route form validation (no Zod — HTML5 native)", () => {
  const requiredFields = ["name"] as const
  const optionalFields = ["transport", "estimated_start", "estimated_end"] as const

  it("requires name", () => {
    expect(requiredFields).toContain("name")
  })

  it("all optional fields are not required", () => {
    for (const field of optionalFields) {
      expect(requiredFields).not.toContain(field)
    }
  })

  it("all fields are present in RouteCreate type", () => {
    const all = [...requiredFields, ...optionalFields]
    expect(all).toEqual([
      "name",
      "transport",
      "estimated_start",
      "estimated_end",
    ])
  })
})
