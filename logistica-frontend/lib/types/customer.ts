export interface CustomerList {
  id: number
  company_name: string
  contact_name: string
  email: string
  city: string
}

export interface CustomerDetail {
  id: number
  company_name: string
  contact_name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  created_at: string
  updated_at: string
}

export interface CustomerCreate {
  company_name: string
  contact_name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
}
