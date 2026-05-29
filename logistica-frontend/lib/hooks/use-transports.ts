import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listTransports, getTransport, createTransport, updateTransport, deleteTransport } from "@/lib/api/transports"
import type { TransportCreate } from "@/lib/types/transport"

export function useTransports(page = 1) {
  return useQuery({
    queryKey: ["transports", page],
    queryFn: () => listTransports(page).then((r) => r.data),
  })
}

export function useTransport(id: number) {
  return useQuery({
    queryKey: ["transports", id],
    queryFn: () => getTransport(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateTransport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: TransportCreate) => createTransport(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transports"] }),
  })
}

export function useUpdateTransport(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: TransportCreate) => updateTransport(id, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transports"] }),
  })
}

export function useDeleteTransport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTransport(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transports"] }),
  })
}
