import axios from "axios"

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem("refresh")
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh,
          })
          localStorage.setItem("access", data.access)
          original.headers.Authorization = `Bearer ${data.access}`
          return api(original)
        } catch {
          clearTokens()
          window.location.href = "/login"
        }
      } else {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export function setTokens(access: string, refresh: string) {
  localStorage.setItem("access", access)
  localStorage.setItem("refresh", refresh)
}

export function clearTokens() {
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")
}
