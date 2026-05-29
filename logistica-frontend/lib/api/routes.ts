import { api } from "@/lib/api/client"
import type { PaginatedResponse } from "@/lib/types"
import type { RouteList, RouteDetail, RouteCreate, RouteStopDetail, RouteStopCreate } from "@/lib/types/route"

export function listRoutes(page = 1) {
  return api.get<PaginatedResponse<RouteList>>(`/routes/?page=${page}`)
}

export function getRoute(id: number) {
  return api.get<RouteDetail>(`/routes/${id}/`)
}

export function createRoute(data: RouteCreate) {
  return api.post<RouteDetail>("/routes/", data)
}

export function updateRoute(id: number, data: RouteCreate) {
  return api.put<RouteDetail>(`/routes/${id}/`, data)
}

export function deleteRoute(id: number) {
  return api.delete(`/routes/${id}/`)
}

export function addRouteStop(routeId: number, data: RouteStopCreate) {
  return api.post<RouteStopDetail>(`/routes/${routeId}/stops/`, data)
}

export function updateRouteStop(routeId: number, stopId: number, data: Partial<RouteStopCreate>) {
  return api.put<RouteStopDetail>(`/routes/${routeId}/stops/${stopId}/`, data)
}
