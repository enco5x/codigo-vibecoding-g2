export interface TransportList {
  id: number
  plate_number: string
  vehicle_type: string | null
  vehicle_model: string | null
  driver_name: string | null
  is_available: boolean
}

export interface TransportDetail {
  id: number
  plate_number: string
  vehicle_type: string | null
  vehicle_model: string | null
  capacity_kg: string | null
  is_available: boolean
  driver: number | null
  created_at: string
  updated_at: string
}

export interface TransportCreate {
  plate_number: string
  vehicle_type?: string
  vehicle_model?: string
  capacity_kg?: number | string | null
  is_available?: boolean
  driver?: number | null
}
