export type ShipmentStatus = "pending" | "assigned" | "in_transit" | "delivered" | "cancelled"

export const STATUS_CHOICES: Record<ShipmentStatus, string> = {
  pending: "Pendiente",
  assigned: "Asignado",
  in_transit: "En tránsito",
  delivered: "Entregado",
  cancelled: "Cancelado",
}

export const STATUS_COLORS: Record<ShipmentStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  assigned: "bg-blue-100 text-blue-700",
  in_transit: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

export interface ShipmentList {
  id: number
  tracking_number: string
  customer_name: string
  status: ShipmentStatus
  status_display: string
  destination_city: string
  scheduled_delivery: string | null
  shipping_cost: string
  created_at: string
}

export interface ShipmentDetail {
  id: number
  tracking_number: string
  customer: { id: number; company_name: string }
  warehouse: { id: number; name: string; code: string } | null
  origin_address: string | null
  destination_address: string
  destination_city: string
  destination_country: string
  scheduled_pickup: string | null
  scheduled_delivery: string | null
  weight_kg: string | null
  shipping_cost: string
  notes: string | null
  status: ShipmentStatus
  status_display: string
  items: ShipmentItemDetail[]
  created_at: string
  updated_at: string
}

export interface ShipmentCreate {
  customer: number
  warehouse?: number | null
  origin_address?: string
  destination_address: string
  destination_city: string
  destination_country: string
  scheduled_pickup?: string | null
  scheduled_delivery?: string | null
  weight_kg?: number | string | null
  notes?: string
}

export interface ShipmentItemDetail {
  id: number
  product: number
  product_name: string
  quantity: number
  unit_price: string
}
