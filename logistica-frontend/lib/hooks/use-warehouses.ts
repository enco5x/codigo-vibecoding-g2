import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listWarehouses, getWarehouse, createWarehouse, updateWarehouse, deleteWarehouse } from "@/lib/api/warehouses"
import type { WarehouseCreate } from "@/lib/types/warehouse"

export function useWarehouses(page = 1) {
  return useQuery({
    queryKey: ["warehouses", page],
    queryFn: () => listWarehouses(page).then((r) => r.data),
  })
}

export function useWarehouse(id: number) {
  return useQuery({
    queryKey: ["warehouses", id],
    queryFn: () => getWarehouse(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateWarehouse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: WarehouseCreate) => createWarehouse(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["warehouses"] }),
  })
}

export function useUpdateWarehouse(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: WarehouseCreate) => updateWarehouse(id, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["warehouses"] }),
  })
}

export function useDeleteWarehouse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteWarehouse(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["warehouses"] }),
  })
}
