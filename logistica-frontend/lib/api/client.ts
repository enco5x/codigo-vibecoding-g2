import axios from "axios"

const API_BASE = "http://localhost:8000/api/v1"

export const api = axios.create({
  baseURL: API_BASE,
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
          const { data } = await axios.post(`${API_BASE}/auth/refresh/`, {
            refresh,
          })
          localStorage.setItem("access", data.access)
          original.headers.Authorization = `Bearer ${data.access}`
          return api(original)
        } catch {
          localStorage.removeItem("access")
          localStorage.removeItem("refresh")
          window.location.href = "/login"
        }
      } else {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export function setTokens(access: string, refresh: string) {
  localStorage.setItem("access", access)
  localStorage.setItem("refresh", refresh)
}

export function clearTokens() {
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")
}
