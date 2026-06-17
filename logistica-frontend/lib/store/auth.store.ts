import { create } from "zustand"
import { api, setTokens, clearTokens } from "@/lib/api/client"
import type { AuthTokens, LoginRequest, User } from "@/lib/types"

interface AuthState {
  isAuthenticated: boolean
  initialized: boolean
  username: string | null
  user: User | null
  userLoading: boolean
  isSuperAdmin: boolean
  login: (data: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  init: () => void
  fetchUser: () => Promise<void>
}

function getInitialAuth(): { isAuthenticated: boolean } {
  if (typeof window === "undefined") return { isAuthenticated: false }
  return { isAuthenticated: !!localStorage.getItem("access") }
}

function getStoredUsername(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("username")
}

export const useAuthStore = create<AuthState>((set, get) => ({
  ...getInitialAuth(),
  initialized: false,
  username: getStoredUsername(),
  user: null,
  userLoading: false,
  isSuperAdmin: false,

  init: () => {
    const hasToken = !!localStorage.getItem("access")
    const storedUser = localStorage.getItem("username")
    set({ isAuthenticated: hasToken, initialized: true, username: storedUser })
    if (hasToken) {
      get().fetchUser()
    }
  },

  login: async (data: LoginRequest) => {
    const res = await api.post<AuthTokens>("/auth/login/", data)
    setTokens(res.data.access, res.data.refresh)
    localStorage.setItem("username", data.username)
    set({ isAuthenticated: true, username: data.username })
    get().fetchUser()
  },

  logout: async () => {
    try {
      await api.post("/auth/logout/")
    } catch {
      // ignore
    }
    clearTokens()
    localStorage.removeItem("username")
    set({ isAuthenticated: false, username: null, user: null, isSuperAdmin: false })
  },

  fetchUser: async () => {
    set({ userLoading: true })
    try {
      const res = await api.get<User>("/auth/me/")
      set({ user: res.data, userLoading: false, isSuperAdmin: res.data.is_superuser })
      localStorage.setItem("username", res.data.username)
    } catch {
      set({ userLoading: false })
    }
  },
}))
