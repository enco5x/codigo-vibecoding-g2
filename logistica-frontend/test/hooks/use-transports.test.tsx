import { describe, it, expect, beforeEach } from "vitest"
import { waitFor } from "@testing-library/react"
import { renderHookWithQuery } from "@/test/utils/renderWithQuery"
import { server } from "@/test/msw/server"
import { transportsHandlers } from "@/test/handlers/transports"
import {
  useTransports,
  useTransport,
  useCreateTransport,
  useUpdateTransport,
  useDeleteTransport,
} from "@/lib/hooks/use-transports"
import { setTokens, clearTokens } from "@/lib/api/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...transportsHandlers)
})

describe("useTransports", () => {
  it("starts in isPending state then returns data", async () => {
    const { result } = renderHookWithQuery(() => useTransports(1))

    expect(result.current.isPending).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(2)
  })

  it("uses correct queryKey", async () => {
    const { result } = renderHookWithQuery(() => useTransports(2))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(0)
  })
})

describe("useTransport", () => {
  it("fetches individual transport", async () => {
    const { result } = renderHookWithQuery(() => useTransport(1))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.plate_number).toBe("ABC-123")
  })
})

describe("useCreateTransport", () => {
  it("creates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useCreateTransport(), { wrapper })
    await result.current.mutateAsync({ plate_number: "NEW-001" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["transports"] })
    invalidateSpy.mockRestore()
  })
})

describe("useUpdateTransport", () => {
  it("updates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useUpdateTransport(1), { wrapper })
    await result.current.mutateAsync({ plate_number: "ABC-123" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["transports"] })
    invalidateSpy.mockRestore()
  })
})

describe("useDeleteTransport", () => {
  it("deletes and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useDeleteTransport(), { wrapper })
    await result.current.mutateAsync(1)

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["transports"] })
    invalidateSpy.mockRestore()
  })
})
