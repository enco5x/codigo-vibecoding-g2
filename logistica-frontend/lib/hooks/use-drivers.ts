import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listDrivers, getDriver, createDriver, updateDriver, deleteDriver } from "@/lib/api/drivers"
import type { DriverCreate } from "@/lib/types/driver"

export function useDrivers(page = 1) {
  return useQuery({
    queryKey: ["drivers", page],
    queryFn: () => listDrivers(page).then((r) => r.data),
  })
}

export function useDriver(id: number) {
  return useQuery({
    queryKey: ["drivers", id],
    queryFn: () => getDriver(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateDriver() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: DriverCreate) => createDriver(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["drivers"] }),
  })
}

export function useUpdateDriver(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: DriverCreate) => updateDriver(id, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["drivers"] }),
  })
}

export function useDeleteDriver() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteDriver(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["drivers"] }),
  })
}
