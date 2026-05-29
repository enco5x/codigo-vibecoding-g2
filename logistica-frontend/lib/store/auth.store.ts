import { create } from "zustand"
import { api, setTokens, clearTokens } from "@/lib/api/client"
import type { AuthTokens, LoginRequest } from "@/lib/types"

interface AuthState {
  isAuthenticated: boolean
  initialized: boolean
  username: string | null
  login: (data: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  init: () => void
}

function getInitialAuth(): { isAuthenticated: boolean } {
  if (typeof window === "undefined") return { isAuthenticated: false }
  return { isAuthenticated: !!localStorage.getItem("access") }
}

function getStoredUsername(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("username")
}

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialAuth(),
  initialized: false,
  username: getStoredUsername(),

  init: () => {
    const hasToken = !!localStorage.getItem("access")
    const storedUser = localStorage.getItem("username")
    set({ isAuthenticated: hasToken, initialized: true, username: storedUser })
  },

  login: async (data: LoginRequest) => {
    const res = await api.post<AuthTokens>("/auth/login/", data)
    setTokens(res.data.access, res.data.refresh)
    localStorage.setItem("username", data.username)
    set({ isAuthenticated: true, username: data.username })
  },

  logout: async () => {
    try {
      await api.post("/auth/logout/")
    } catch {
      // ignore
    }
    clearTokens()
    localStorage.removeItem("username")
    set({ isAuthenticated: false, username: null })
  },
}))
