import { api } from "@/lib/api/client"
import type { PaginatedResponse } from "@/lib/types"
import type { ProductList, ProductDetail, ProductCreate } from "@/lib/types/product"

export function listProducts(page = 1) {
  return api.get<PaginatedResponse<ProductList>>(`/products/?page=${page}`)
}

export function getProduct(id: number) {
  return api.get<ProductDetail>(`/products/${id}/`)
}

export function getProductBySku(sku: string) {
  return api.get<ProductDetail>(`/products/by-sku/${sku}/`)
}

export function createProduct(data: ProductCreate) {
  return api.post<ProductDetail>("/products/", data)
}

export function updateProduct(id: number, data: ProductCreate) {
  return api.put<ProductDetail>(`/products/${id}/`, data)
}

export function deleteProduct(id: number) {
  return api.delete(`/products/${id}/`)
}
