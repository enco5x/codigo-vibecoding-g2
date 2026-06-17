import { describe, it, expect, beforeEach, vi } from "vitest"
import { setTokens, clearTokens, API_BASE } from "@/lib/axios"
import { http, HttpResponse } from "msw"
import { server } from "@/test/msw/server"

beforeEach(() => {
  clearTokens()
  vi.restoreAllMocks()
})

describe("setTokens", () => {
  it("stores access and refresh in localStorage", () => {
    setTokens("my-access", "my-refresh")
    expect(localStorage.getItem("access")).toBe("my-access")
    expect(localStorage.getItem("refresh")).toBe("my-refresh")
  })
})

describe("clearTokens", () => {
  it("removes access and refresh from localStorage", () => {
    setTokens("a", "r")
    clearTokens()
    expect(localStorage.getItem("access")).toBeNull()
    expect(localStorage.getItem("refresh")).toBeNull()
  })
})

describe("request interceptor", () => {
  it("adds Bearer header when token exists", async () => {
    setTokens("test-bearer-token", "test-refresh")
    server.use(
      http.get(`${API_BASE}/auth/me/`, ({ request }) => {
        const auth = request.headers.get("Authorization")
        return HttpResponse.json({ auth_sent: auth })
      }),
    )
    const { api } = await import("@/lib/axios")
    const res = await api.get("/auth/me/")
    expect(res.data.auth_sent).toBe("Bearer test-bearer-token")
  })
})

describe("response interceptor", () => {
  it("retries original request after successful token refresh", async () => {
    setTokens("expired-token", "test-refresh-token")

    let callCount = 0
    server.use(
      http.get(`${API_BASE}/auth/me/`, () => {
        callCount++
        if (callCount === 1) {
          return HttpResponse.json({ detail: "Unauthorized" }, { status: 401 })
        }
        return HttpResponse.json({ username: "admin" })
      }),
    )

    const { api: testApi } = await import("@/lib/axios")
    const res = await testApi.get("/auth/me/")
    expect(res.data.username).toBe("admin")
    expect(callCount).toBe(2)
  })

  it("clears tokens when refresh fails", async () => {
    setTokens("expired-token", "bad-refresh-token")

    server.use(
      http.get(`${API_BASE}/auth/me/`, () => {
        return HttpResponse.json({ detail: "Unauthorized" }, { status: 401 })
      }),
    )

    const { api: testApi } = await import("@/lib/axios")
    await expect(testApi.get("/auth/me/")).rejects.toThrow()
    expect(localStorage.getItem("access")).toBeNull()
    expect(localStorage.getItem("refresh")).toBeNull()
  })

  it("passes through non-401 errors", async () => {
    setTokens("valid-token", "valid-refresh")

    server.use(
      http.get(`${API_BASE}/auth/me/`, () => {
        return HttpResponse.json({ detail: "Server error" }, { status: 500 })
      }),
    )

    const { api: testApi } = await import("@/lib/axios")
    await expect(testApi.get("/auth/me/")).rejects.toThrow()
  })
})
