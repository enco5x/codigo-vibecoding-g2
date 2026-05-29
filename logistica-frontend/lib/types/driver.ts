export interface DriverList {
  id: number
  license_number: string
  phone: string | null
  email: string | null
  is_available: boolean
}

export interface DriverDetail {
  id: number
  license_number: string
  phone: string | null
  email: string | null
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface DriverCreate {
  license_number: string
  phone?: string
  email?: string
  is_available?: boolean
}
