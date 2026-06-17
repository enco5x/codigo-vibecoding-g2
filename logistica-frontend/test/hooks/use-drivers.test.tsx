import { describe, it, expect, beforeEach } from "vitest"
import { waitFor } from "@testing-library/react"
import { renderHookWithQuery } from "@/test/utils/renderWithQuery"
import { server } from "@/test/msw/server"
import { driversHandlers } from "@/test/handlers/drivers"
import {
  useDrivers,
  useDriver,
  useCreateDriver,
  useUpdateDriver,
  useDeleteDriver,
} from "@/lib/hooks/use-drivers"
import { setTokens, clearTokens } from "@/lib/axios"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...driversHandlers)
})

describe("useDrivers", () => {
  it("starts in isPending state then returns data", async () => {
    const { result } = renderHookWithQuery(() => useDrivers(1))

    expect(result.current.isPending).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(2)
  })

  it("uses correct queryKey", async () => {
    const { result } = renderHookWithQuery(() => useDrivers(2))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(0)
  })
})

describe("useDriver", () => {
  it("fetches individual driver", async () => {
    const { result } = renderHookWithQuery(() => useDriver(1))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.license_number).toBe("LIC-12345")
  })
})

describe("useCreateDriver", () => {
  it("creates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useCreateDriver(), { wrapper })
    await result.current.mutateAsync({ license_number: "LIC-NEW" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["drivers"] })
    invalidateSpy.mockRestore()
  })
})

describe("useUpdateDriver", () => {
  it("updates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useUpdateDriver(1), { wrapper })
    await result.current.mutateAsync({ license_number: "LIC-12345" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["drivers"] })
    invalidateSpy.mockRestore()
  })
})

describe("useDeleteDriver", () => {
  it("deletes and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useDeleteDriver(), { wrapper })
    await result.current.mutateAsync(1)

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["drivers"] })
    invalidateSpy.mockRestore()
  })
})
