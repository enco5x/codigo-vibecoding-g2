export interface SupplierList {
  id: number
  company_name: string
  contact_name: string | null
  email: string | null
  city: string | null
}

export interface SupplierDetail {
  id: number
  company_name: string
  contact_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  country: string | null
  created_at: string
  updated_at: string
}

export interface SupplierCreate {
  company_name: string
  contact_name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
}
