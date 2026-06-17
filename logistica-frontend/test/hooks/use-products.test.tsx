import { describe, it, expect, beforeEach } from "vitest"
import { waitFor } from "@testing-library/react"
import { renderHookWithQuery } from "@/test/utils/renderWithQuery"
import { server } from "@/test/msw/server"
import { productsHandlers } from "@/test/handlers/products"
import {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/lib/hooks/use-products"
import { setTokens, clearTokens } from "@/lib/axios"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...productsHandlers)
})

describe("useProducts", () => {
  it("starts in isPending state then returns data", async () => {
    const { result } = renderHookWithQuery(() => useProducts(1))

    expect(result.current.isPending).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(2)
  })

  it("uses correct queryKey", async () => {
    const { result } = renderHookWithQuery(() => useProducts(2))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(0)
  })
})

describe("useProduct", () => {
  it("fetches individual product", async () => {
    const { result } = renderHookWithQuery(() => useProduct(1))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe("Widget A")
  })
})

describe("useCreateProduct", () => {
  it("creates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useCreateProduct(), { wrapper })
    await result.current.mutateAsync({ sku: "P-003", name: "Nuevo", unit_price: 10 })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["products"] })
    invalidateSpy.mockRestore()
  })
})

describe("useUpdateProduct", () => {
  it("updates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useUpdateProduct(1), { wrapper })
    await result.current.mutateAsync({ sku: "P-001", name: "Editado", unit_price: 15 })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["products"] })
    invalidateSpy.mockRestore()
  })
})

describe("useDeleteProduct", () => {
  it("deletes and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useDeleteProduct(), { wrapper })
    await result.current.mutateAsync(1)

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["products"] })
    invalidateSpy.mockRestore()
  })
})
