import { describe, it, expect, beforeEach } from "vitest"
import { waitFor } from "@testing-library/react"
import { renderHookWithQuery } from "@/test/utils/renderWithQuery"
import { server } from "@/test/msw/server"
import { suppliersHandlers } from "@/test/handlers/suppliers"
import {
  useSuppliers,
  useSupplier,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
} from "@/lib/hooks/use-suppliers"
import { setTokens, clearTokens } from "@/lib/api/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...suppliersHandlers)
})

describe("useSuppliers", () => {
  it("starts in isPending state then returns data", async () => {
    const { result } = renderHookWithQuery(() => useSuppliers(1))

    expect(result.current.isPending).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(2)
  })

  it("uses correct queryKey", async () => {
    const { result } = renderHookWithQuery(() => useSuppliers(2))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(0)
  })
})

describe("useSupplier", () => {
  it("fetches individual supplier", async () => {
    const { result } = renderHookWithQuery(() => useSupplier(1))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.company_name).toBe("Proveedor A")
  })
})

describe("useCreateSupplier", () => {
  it("creates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useCreateSupplier(), { wrapper })
    await result.current.mutateAsync({ company_name: "Nuevo" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["suppliers"] })
    invalidateSpy.mockRestore()
  })
})

describe("useUpdateSupplier", () => {
  it("updates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useUpdateSupplier(1), { wrapper })
    await result.current.mutateAsync({ company_name: "Editado" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["suppliers"] })
    invalidateSpy.mockRestore()
  })
})

describe("useDeleteSupplier", () => {
  it("deletes and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useDeleteSupplier(), { wrapper })
    await result.current.mutateAsync(1)

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["suppliers"] })
    invalidateSpy.mockRestore()
  })
})
