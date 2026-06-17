import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUsers, getUser, createUser, updateUser, deleteUser, getGroups, getGroup, createGroup, updateGroup, deleteGroup, getPermissions } from "@/lib/api/users"
import type { UserCreate, UserUpdate, GroupCreate, GroupUpdate } from "@/lib/types"

export function useUsers(page = 1) {
  return useQuery({
    queryKey: ["users", page],
    queryFn: () => getUsers(page),
  })
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UserCreate) => createUser(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  })
}

export function useUpdateUser(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UserUpdate) => updateUser(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  })
}

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: () => getGroups(),
  })
}

export function useGroup(id: number) {
  return useQuery({
    queryKey: ["groups", id],
    queryFn: () => getGroup(id),
    enabled: !!id,
  })
}

export function useCreateGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: GroupCreate) => createGroup(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["groups"] }),
  })
}

export function useUpdateGroup(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: GroupUpdate) => updateGroup(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["groups"] }),
  })
}

export function useDeleteGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteGroup(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["groups"] }),
  })
}

export function usePermissions() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: () => getPermissions(),
  })
}
