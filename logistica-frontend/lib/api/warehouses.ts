import { api } from "@/lib/api/client"
import type { PaginatedResponse } from "@/lib/types"
import type { WarehouseList, WarehouseDetail, WarehouseCreate } from "@/lib/types/warehouse"

export function listWarehouses(page = 1) {
  return api.get<PaginatedResponse<WarehouseList>>(`/warehouses/?page=${page}`)
}

export function getWarehouse(id: number) {
  return api.get<WarehouseDetail>(`/warehouses/${id}/`)
}

export function createWarehouse(data: WarehouseCreate) {
  return api.post<WarehouseDetail>("/warehouses/", data)
}

export function updateWarehouse(id: number, data: WarehouseCreate) {
  return api.put<WarehouseDetail>(`/warehouses/${id}/`, data)
}

export function deleteWarehouse(id: number) {
  return api.delete(`/warehouses/${id}/`)
}
