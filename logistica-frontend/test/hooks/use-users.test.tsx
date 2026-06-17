import { describe, it, expect, beforeEach } from "vitest"
import { waitFor } from "@testing-library/react"
import { renderHookWithQuery } from "@/test/utils/renderWithQuery"
import { server } from "@/test/msw/server"
import { usersHandlers } from "@/test/handlers/users"
import {
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useGroups,
  useGroup,
  useCreateGroup,
  useUpdateGroup,
  useDeleteGroup,
  usePermissions,
} from "@/lib/hooks/use-users"
import { setTokens, clearTokens } from "@/lib/axios"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...usersHandlers)
})

describe("useUsers", () => {
  it("starts in isPending state then returns data", async () => {
    const { result } = renderHookWithQuery(() => useUsers(1))

    expect(result.current.isPending).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(2)
  })

  it("uses correct queryKey", async () => {
    const { result } = renderHookWithQuery(() => useUsers(2))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(0)
  })
})

describe("useUser", () => {
  it("fetches individual user", async () => {
    const { result } = renderHookWithQuery(() => useUser(1))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.username).toBe("admin")
  })
})

describe("useCreateUser", () => {
  it("creates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useCreateUser(), { wrapper })
    await result.current.mutateAsync({ username: "nuevo", password: "pass123" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["users"] })
    invalidateSpy.mockRestore()
  })
})

describe("useUpdateUser", () => {
  it("updates and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useUpdateUser(1), { wrapper })
    await result.current.mutateAsync({ first_name: "Editado" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["users"] })
    invalidateSpy.mockRestore()
  })
})

describe("useDeleteUser", () => {
  it("deletes and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useDeleteUser(), { wrapper })
    await result.current.mutateAsync(1)

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["users"] })
    invalidateSpy.mockRestore()
  })
})

describe("useGroups", () => {
  it("fetches groups list", async () => {
    const { result } = renderHookWithQuery(() => useGroups())
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
  })
})

describe("useGroup", () => {
  it("fetches individual group", async () => {
    const { result } = renderHookWithQuery(() => useGroup(1))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe("admin")
  })
})

describe("useCreateGroup", () => {
  it("creates group and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useCreateGroup(), { wrapper })
    await result.current.mutateAsync({ name: "new-group" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["groups"] })
    invalidateSpy.mockRestore()
  })
})

describe("useUpdateGroup", () => {
  it("updates group and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useUpdateGroup(1), { wrapper })
    await result.current.mutateAsync({ name: "edit-group" })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["groups"] })
    invalidateSpy.mockRestore()
  })
})

describe("useDeleteGroup", () => {
  it("deletes group and invalidates list query", async () => {
    const qc = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )

    const invalidateSpy = vi.spyOn(qc, "invalidateQueries")

    const { result } = renderHookWithQuery(() => useDeleteGroup(), { wrapper })
    await result.current.mutateAsync(1)

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["groups"] })
    invalidateSpy.mockRestore()
  })
})

describe("usePermissions", () => {
  it("fetches permissions list", async () => {
    const { result } = renderHookWithQuery(() => usePermissions())
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
  })
})
