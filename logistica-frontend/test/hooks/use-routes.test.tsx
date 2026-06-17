import { describe, it, expect, beforeEach } from "vitest"
import { waitFor } from "@testing-library/react"
import { renderHookWithQuery } from "@/test/utils/renderWithQuery"
import { server } from "@/test/msw/server"
import { routesHandlers } from "@/test/handlers/routes"
import {
  useRoutes,
  useRoute,
  useCreateRoute,
  useUpdateRoute,
  useDeleteRoute,
  useAddRouteStop,
} from "@/lib/hooks/use-routes"
import { setTokens, clearTokens } from "@/lib/api/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...routesHandlers)
})

describe("useRoutes", () => {
  it("starts in isPending state then returns data", async () => {
    const { result } = renderHookWithQuery(() => useRoutes(1))

    expect(result.current.isPending).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(2)
  })

  it("uses correct queryKey", async () => {
    const { result } = renderHookWithQuery(() => useRoutes(2))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(0)
  })
})

describe("useRoute", () => {
  it("fetches individual route", async () => {
    const { result } = renderHookWithQuery(() => useRoute(1))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe("Ruta Santiago")
  })
})

describe("useCreateRoute", () => {
  it("creates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useCreateRoute(), { wrapper })
    await result.current.mutateAsync({ name: "Ruta Nueva" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["routes"] })
    invalidateSpy.mockRestore()
  })
})

describe("useUpdateRoute", () => {
  it("updates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useUpdateRoute(1), { wrapper })
    await result.current.mutateAsync({ name: "Ruta Editada" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["routes"] })
    invalidateSpy.mockRestore()
  })
})

describe("useDeleteRoute", () => {
  it("deletes and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useDeleteRoute(), { wrapper })
    await result.current.mutateAsync(1)

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["routes"] })
    invalidateSpy.mockRestore()
  })
})

describe("useAddRouteStop", () => {
  it("adds stop and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useAddRouteStop(1), { wrapper })
    await result.current.mutateAsync({ order: 3, address: "Parada 3", city: "Santiago" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["routes"] })
    invalidateSpy.mockRestore()
  })
})
