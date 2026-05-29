export interface ProductList {
  id: number
  sku: string
  name: string
  category: string | null
  unit_price: string
  stock_quantity: number
  is_active: boolean
  supplier_name: string | null
  warehouse_name: string | null
}

export interface ProductDetail {
  id: number
  sku: string
  name: string
  description: string | null
  category: string | null
  unit_price: string
  supplier: number | null
  warehouse: number | null
  stock_quantity: number
  weight_kg: string | null
  dimensions: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductCreate {
  sku: string
  name: string
  description?: string
  category?: string
  unit_price: number | string
  supplier?: number | null
  warehouse?: number | null
  stock_quantity?: number
  weight_kg?: number | string | null
  dimensions?: string
  is_active?: boolean
}
