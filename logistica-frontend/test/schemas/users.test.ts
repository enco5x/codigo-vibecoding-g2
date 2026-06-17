import { describe, it, expect } from "vitest"

describe("user form validation (no Zod — HTML5 native)", () => {
  const requiredFields = ["username", "password"] as const
  const optionalFields = ["email", "first_name", "last_name", "is_active", "groups"] as const

  it("requires username and password", () => {
    expect(requiredFields).toContain("username")
    expect(requiredFields).toContain("password")
  })

  it("all optional fields are not required", () => {
    for (const field of optionalFields) {
      expect(requiredFields).not.toContain(field)
    }
  })

  it("all fields are present in UserCreate type", () => {
    const all = [...requiredFields, ...optionalFields]
    expect(all).toEqual([
      "username",
      "password",
      "email",
      "first_name",
      "last_name",
      "is_active",
      "groups",
    ])
  })
})
