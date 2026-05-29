import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier } from "@/lib/api/suppliers"
import type { SupplierCreate } from "@/lib/types/supplier"

export function useSuppliers(page = 1) {
  return useQuery({
    queryKey: ["suppliers", page],
    queryFn: () => listSuppliers(page).then((r) => r.data),
  })
}

export function useSupplier(id: number) {
  return useQuery({
    queryKey: ["suppliers", id],
    queryFn: () => getSupplier(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateSupplier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: SupplierCreate) => createSupplier(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["suppliers"] }),
  })
}

export function useUpdateSupplier(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: SupplierCreate) => updateSupplier(id, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["suppliers"] }),
  })
}

export function useDeleteSupplier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteSupplier(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["suppliers"] }),
  })
}
