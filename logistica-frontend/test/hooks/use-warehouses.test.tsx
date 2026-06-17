import { describe, it, expect, beforeEach } from "vitest"
import { waitFor } from "@testing-library/react"
import { renderHookWithQuery } from "@/test/utils/renderWithQuery"
import { server } from "@/test/msw/server"
import { warehousesHandlers } from "@/test/handlers/warehouses"
import {
  useWarehouses,
  useWarehouse,
  useCreateWarehouse,
  useUpdateWarehouse,
  useDeleteWarehouse,
} from "@/lib/hooks/use-warehouses"
import { setTokens, clearTokens } from "@/lib/axios"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...warehousesHandlers)
})

describe("useWarehouses", () => {
  it("starts in isPending state then returns data", async () => {
    const { result } = renderHookWithQuery(() => useWarehouses(1))

    expect(result.current.isPending).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(2)
  })

  it("uses correct queryKey", async () => {
    const { result } = renderHookWithQuery(() => useWarehouses(2))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(0)
  })
})

describe("useWarehouse", () => {
  it("fetches individual warehouse", async () => {
    const { result } = renderHookWithQuery(() => useWarehouse(1))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe("Bodega Central")
  })
})

describe("useCreateWarehouse", () => {
  it("creates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useCreateWarehouse(), { wrapper })
    await result.current.mutateAsync({ name: "Nuevo", code: "N-001" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["warehouses"] })
    invalidateSpy.mockRestore()
  })
})

describe("useUpdateWarehouse", () => {
  it("updates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useUpdateWarehouse(1), { wrapper })
    await result.current.mutateAsync({ name: "Editado", code: "BC-001" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["warehouses"] })
    invalidateSpy.mockRestore()
  })
})

describe("useDeleteWarehouse", () => {
  it("deletes and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useDeleteWarehouse(), { wrapper })
    await result.current.mutateAsync(1)

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["warehouses"] })
    invalidateSpy.mockRestore()
  })
})
