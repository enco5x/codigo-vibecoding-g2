import { describe, it, expect, beforeEach } from "vitest"
import { waitFor } from "@testing-library/react"
import { renderHookWithQuery, renderWithQuery } from "@/test/utils/renderWithQuery"
import { server } from "@/test/msw/server"
import { customersHandlers } from "@/test/handlers/customers"
import {
  useCustomers,
  useCustomer,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "@/lib/hooks/use-customers"
import { setTokens, clearTokens } from "@/lib/axios"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...customersHandlers)
})

describe("useCustomers", () => {
  it("starts in isPending state then returns data", async () => {
    const { result } = renderHookWithQuery(() => useCustomers(1))

    expect(result.current.isPending).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(2)
  })

  it("uses correct queryKey", async () => {
    const { result } = renderHookWithQuery(() => useCustomers(2))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(0)
  })
})

describe("useCustomer", () => {
  it("fetches individual customer", async () => {
    const { result } = renderHookWithQuery(() => useCustomer(1))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.company_name).toBe("Empresa A")
  })
})

describe("useCreateCustomer", () => {
  it("creates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useCreateCustomer(), { wrapper })
    await result.current.mutateAsync({ company_name: "Nuevo" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["customers"] })
    invalidateSpy.mockRestore()
  })
})

describe("useUpdateCustomer", () => {
  it("updates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useUpdateCustomer(1), { wrapper })
    await result.current.mutateAsync({ company_name: "Editado" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["customers"] })
    invalidateSpy.mockRestore()
  })
})

describe("useDeleteCustomer", () => {
  it("deletes and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useDeleteCustomer(), { wrapper })
    await result.current.mutateAsync(1)

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["customers"] })
    invalidateSpy.mockRestore()
  })
})
