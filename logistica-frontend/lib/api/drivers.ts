import { api } from "@/lib/api/client"
import type { PaginatedResponse } from "@/lib/types"
import type { DriverList, DriverDetail, DriverCreate } from "@/lib/types/driver"

export function listDrivers(page = 1) {
  return api.get<PaginatedResponse<DriverList>>(`/drivers/?page=${page}`)
}

export function getDriver(id: number) {
  return api.get<DriverDetail>(`/drivers/${id}/`)
}

export function createDriver(data: DriverCreate) {
  return api.post<DriverDetail>("/drivers/", data)
}

export function updateDriver(id: number, data: DriverCreate) {
  return api.put<DriverDetail>(`/drivers/${id}/`, data)
}

export function deleteDriver(id: number) {
  return api.delete(`/drivers/${id}/`)
}
