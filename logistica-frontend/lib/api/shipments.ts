import { api } from "@/lib/api/client"
import type { PaginatedResponse } from "@/lib/types"
import type { ShipmentList, ShipmentDetail, ShipmentCreate, ShipmentItemDetail } from "@/lib/types/shipment"

export function listShipments(page = 1) {
  return api.get<PaginatedResponse<ShipmentList>>(`/shipments/?page=${page}`)
}

export function getShipment(id: number) {
  return api.get<ShipmentDetail>(`/shipments/${id}/`)
}

export function getShipmentByTracking(tn: string) {
  return api.get<ShipmentDetail>(`/shipments/tracking/${tn}/`)
}

export function createShipment(data: ShipmentCreate) {
  return api.post<ShipmentDetail>("/shipments/", data)
}

export function updateShipment(id: number, data: ShipmentCreate) {
  return api.put<ShipmentDetail>(`/shipments/${id}/`, data)
}

export function updateShipmentStatus(id: number, status: string) {
  return api.patch<ShipmentDetail>(`/shipments/${id}/status/`, { status })
}

export function addShipmentItem(shipmentId: number, data: { product: number; quantity: number; unit_price: number | string }) {
  return api.post<ShipmentItemDetail>(`/shipments/${shipmentId}/items/`, data)
}

export function deleteShipment(id: number) {
  return api.delete(`/shipments/${id}/`)
}
