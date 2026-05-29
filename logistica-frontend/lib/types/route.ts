export type RouteStatus = "pending" | "in_progress" | "completed"

export const ROUTE_STATUS_CHOICES: Record<RouteStatus, string> = {
  pending: "Pendiente",
  in_progress: "En curso",
  completed: "Completada",
}

export const ROUTE_STATUS_COLORS: Record<RouteStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
}

export type StopStatus = "pending" | "arrived" | "completed"

export interface RouteList {
  id: number
  name: string
  transport_id: number | null
  transport_plate: string | null
  status: RouteStatus
  estimated_start: string | null
  estimated_end: string | null
  created_at: string
}

export interface RouteDetail {
  id: number
  name: string
  transport: number | null
  transport_plate: string | null
  status: RouteStatus
  estimated_start: string | null
  estimated_end: string | null
  stops: RouteStopDetail[]
  created_at: string
  updated_at: string
}

export interface RouteCreate {
  name: string
  transport?: number | null
  estimated_start?: string | null
  estimated_end?: string | null
}

export interface RouteStopDetail {
  id: number
  order: number
  address: string | null
  city: string | null
  estimated_arrival: string | null
  notes: string | null
  status: StopStatus
}

export interface RouteStopCreate {
  order: number
  address?: string
  city?: string
  estimated_arrival?: string | null
  notes?: string
}
