import { api } from "./client"
import type { User, UserCreate, UserUpdate, Group, GroupCreate, GroupUpdate, Permission } from "@/lib/types"

export async function getUsers(page = 1): Promise<{ count: number; next: string | null; previous: string | null; results: User[] }> {
  const { data } = await api.get("/auth/users/", { params: { page } })
  return data
}

export async function createUser(input: UserCreate): Promise<User> {
  const { data } = await api.post("/auth/users/", input)
  return data
}

export async function getUser(id: number): Promise<User> {
  const { data } = await api.get(`/auth/users/${id}/`)
  return data
}

export async function updateUser(id: number, input: UserUpdate): Promise<User> {
  const { data } = await api.patch(`/auth/users/${id}/`, input)
  return data
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/auth/users/${id}/`)
}

export async function getGroups(): Promise<Group[]> {
  const { data } = await api.get("/auth/groups/")
  return data
}

export async function createGroup(input: GroupCreate): Promise<Group> {
  const { data } = await api.post("/auth/groups/", input)
  return data
}

export async function getGroup(id: number): Promise<Group> {
  const { data } = await api.get(`/auth/groups/${id}/`)
  return data
}

export async function updateGroup(id: number, input: GroupUpdate): Promise<Group> {
  const { data } = await api.patch(`/auth/groups/${id}/`, input)
  return data
}

export async function deleteGroup(id: number): Promise<void> {
  await api.delete(`/auth/groups/${id}/`)
}

export async function getPermissions(): Promise<Permission[]> {
  const { data } = await api.get("/auth/permissions/")
  return data
}
