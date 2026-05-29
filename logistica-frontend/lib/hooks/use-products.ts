import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from "@/lib/api/products"
import type { ProductCreate } from "@/lib/types/product"

export function useProducts(page = 1) {
  return useQuery({
    queryKey: ["products", page],
    queryFn: () => listProducts(page).then((r) => r.data),
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ProductCreate) => createProduct(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  })
}

export function useUpdateProduct(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ProductCreate) => updateProduct(id, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  })
}
