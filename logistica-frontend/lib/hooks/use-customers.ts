import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } from "@/lib/api/customers"
import type { CustomerCreate } from "@/lib/types/customer"

export function useCustomers(page = 1) {
  return useQuery({
    queryKey: ["customers", page],
    queryFn: () => listCustomers(page).then((r) => r.data),
  })
}

export function useCustomer(id: number) {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => getCustomer(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CustomerCreate) => createCustomer(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  })
}

export function useUpdateCustomer(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CustomerCreate) => updateCustomer(id, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  })
}

export function useDeleteCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  })
}
