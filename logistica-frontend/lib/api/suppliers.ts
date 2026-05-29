import { api } from "@/lib/api/client"
import type { PaginatedResponse } from "@/lib/types"
import type { SupplierList, SupplierDetail, SupplierCreate } from "@/lib/types/supplier"

export function listSuppliers(page = 1) {
  return api.get<PaginatedResponse<SupplierList>>(`/suppliers/?page=${page}`)
}

export function getSupplier(id: number) {
  return api.get<SupplierDetail>(`/suppliers/${id}/`)
}

export function createSupplier(data: SupplierCreate) {
  return api.post<SupplierDetail>("/suppliers/", data)
}

export function updateSupplier(id: number, data: SupplierCreate) {
  return api.put<SupplierDetail>(`/suppliers/${id}/`, data)
}

export function deleteSupplier(id: number) {
  return api.delete(`/suppliers/${id}/`)
}
