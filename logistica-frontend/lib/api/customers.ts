import { api } from "@/lib/api/client"
import type { PaginatedResponse } from "@/lib/types"
import type { CustomerList, CustomerDetail, CustomerCreate } from "@/lib/types/customer"

export function listCustomers(page = 1) {
  return api.get<PaginatedResponse<CustomerList>>(`/customers/?page=${page}`)
}

export function getCustomer(id: number) {
  return api.get<CustomerDetail>(`/customers/${id}/`)
}

export function createCustomer(data: CustomerCreate) {
  return api.post<CustomerDetail>("/customers/", data)
}

export function updateCustomer(id: number, data: CustomerCreate) {
  return api.put<CustomerDetail>(`/customers/${id}/`, data)
}

export function deleteCustomer(id: number) {
  return api.delete(`/customers/${id}/`)
}
