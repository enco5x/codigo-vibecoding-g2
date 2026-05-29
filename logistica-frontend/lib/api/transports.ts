import { api } from "@/lib/api/client"
import type { PaginatedResponse } from "@/lib/types"
import type { TransportList, TransportDetail, TransportCreate } from "@/lib/types/transport"

export function listTransports(page = 1) {
  return api.get<PaginatedResponse<TransportList>>(`/transports/?page=${page}`)
}

export function getTransport(id: number) {
  return api.get<TransportDetail>(`/transports/${id}/`)
}

export function createTransport(data: TransportCreate) {
  return api.post<TransportDetail>("/transports/", data)
}

export function updateTransport(id: number, data: TransportCreate) {
  return api.put<TransportDetail>(`/transports/${id}/`, data)
}

export function deleteTransport(id: number) {
  return api.delete(`/transports/${id}/`)
}
