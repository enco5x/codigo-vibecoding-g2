import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listShipments, getShipment, createShipment, updateShipment, updateShipmentStatus, addShipmentItem, deleteShipment } from "@/lib/api/shipments"
import type { ShipmentCreate } from "@/lib/types/shipment"

export function useShipments(page = 1) {
  return useQuery({
    queryKey: ["shipments", page],
    queryFn: () => listShipments(page).then((r) => r.data),
  })
}

export function useShipment(id: number) {
  return useQuery({
    queryKey: ["shipments", id],
    queryFn: () => getShipment(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateShipment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ShipmentCreate) => createShipment(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shipments"] }),
  })
}

export function useUpdateShipment(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ShipmentCreate) => updateShipment(id, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shipments"] }),
  })
}

export function useUpdateShipmentStatus(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (status: string) => updateShipmentStatus(id, status).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shipments"] }),
  })
}

export function useAddShipmentItem(shipmentId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { product: number; quantity: number; unit_price: number | string }) =>
      addShipmentItem(shipmentId, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shipments"] }),
  })
}

export function useDeleteShipment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteShipment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shipments"] }),
  })
}
