import { describe, it, expect, beforeEach } from "vitest"
import { setTokens, clearTokens } from "@/lib/api/client"
import { login, logout, getMe, refreshToken } from "@/lib/auth"

beforeEach(() => {
  clearTokens()
})

describe("login", () => {
  it("returns tokens for valid credentials", async () => {
    const tokens = await login({ username: "admin", password: "admin123" })
    expect(tokens).toEqual({
      access: "test-access-token",
      refresh: "test-refresh-token",
    })
  })

  it("throws for invalid credentials", async () => {
    await expect(
      login({ username: "bad", password: "wrong" }),
    ).rejects.toThrow()
  })
})

describe("logout", () => {
  it("calls logout endpoint", async () => {
    setTokens("valid-token", "valid-refresh")
    await expect(logout()).resolves.toBeUndefined()
  })
})

describe("getMe", () => {
  it("returns current user", async () => {
    setTokens("valid-token", "valid-refresh")
    const user = await getMe()
    expect(user).toMatchObject({
      id: 1,
      username: "admin",
      email: "admin@test.com",
    })
  })
})

describe("refreshToken", () => {
  it("returns new access token", async () => {
    setTokens("valid-token", "test-refresh-token")
    const result = await refreshToken("test-refresh-token")
    expect(result).toEqual({ access: "refreshed-access-token" })
  })
})
