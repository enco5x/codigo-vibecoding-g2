import { describe, it, expect, beforeEach } from "vitest"
import { waitFor } from "@testing-library/react"
import { renderHookWithQuery } from "@/test/utils/renderWithQuery"
import { server } from "@/test/msw/server"
import { shipmentsHandlers } from "@/test/handlers/shipments"
import {
  useShipments,
  useShipment,
  useCreateShipment,
  useUpdateShipment,
  useUpdateShipmentStatus,
  useAddShipmentItem,
  useDeleteShipment,
} from "@/lib/hooks/use-shipments"
import { setTokens, clearTokens } from "@/lib/axios"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...shipmentsHandlers)
})

describe("useShipments", () => {
  it("starts in isPending state then returns data", async () => {
    const { result } = renderHookWithQuery(() => useShipments(1))

    expect(result.current.isPending).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(2)
  })

  it("uses correct queryKey", async () => {
    const { result } = renderHookWithQuery(() => useShipments(2))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(0)
  })
})

describe("useShipment", () => {
  it("fetches individual shipment", async () => {
    const { result } = renderHookWithQuery(() => useShipment(1))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.tracking_number).toBe("TRK-001")
  })
})

describe("useCreateShipment", () => {
  it("creates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useCreateShipment(), { wrapper })
    await result.current.mutateAsync({
      customer: 1,
      destination_address: "Av. Test 123",
      destination_city: "Test",
      destination_country: "Chile",
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["shipments"] })
    invalidateSpy.mockRestore()
  })
})

describe("useUpdateShipment", () => {
  it("updates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useUpdateShipment(1), { wrapper })
    await result.current.mutateAsync({
      customer: 1,
      destination_address: "Av. Test 456",
      destination_city: "Test",
      destination_country: "Chile",
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["shipments"] })
    invalidateSpy.mockRestore()
  })
})

describe("useUpdateShipmentStatus", () => {
  it("updates status and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useUpdateShipmentStatus(1), { wrapper })
    await result.current.mutateAsync("delivered")

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["shipments"] })
    invalidateSpy.mockRestore()
  })
})

describe("useAddShipmentItem", () => {
  it("adds item and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useAddShipmentItem(1), { wrapper })
    await result.current.mutateAsync({ product: 2, quantity: 5, unit_price: "10.00" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["shipments"] })
    invalidateSpy.mockRestore()
  })
})

describe("useDeleteShipment", () => {
  it("deletes and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useDeleteShipment(), { wrapper })
    await result.current.mutateAsync(1)

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["shipments"] })
    invalidateSpy.mockRestore()
  })
})
