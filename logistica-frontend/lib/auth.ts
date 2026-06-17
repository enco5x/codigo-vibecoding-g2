import { api } from "@/lib/api/client"
import type { AuthTokens, LoginRequest, User } from "@/lib/types"

export async function login(data: LoginRequest): Promise<AuthTokens> {
  const res = await api.post<AuthTokens>("/auth/login/", data)
  return res.data
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout/")
}

export async function refreshToken(
  refresh: string,
): Promise<Pick<AuthTokens, "access">> {
  const res = await api.post<Pick<AuthTokens, "access">>("/auth/refresh/", {
    refresh,
  })
  return res.data
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>("/auth/me/")
  return res.data
}
