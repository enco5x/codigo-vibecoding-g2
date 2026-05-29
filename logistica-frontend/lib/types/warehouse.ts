export interface WarehouseList {
  id: number
  name: string
  code: string
  city: string
  is_active: boolean
}

export interface WarehouseDetail {
  id: number
  name: string
  code: string
  address: string
  city: string
  country: string
  capacity: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WarehouseCreate {
  name: string
  code: string
  address?: string
  city?: string
  country?: string
  capacity?: number | null
  is_active?: boolean
}
