import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listRoutes, getRoute, createRoute, updateRoute, deleteRoute, addRouteStop } from "@/lib/api/routes"
import type { RouteCreate, RouteStopCreate } from "@/lib/types/route"

export function useRoutes(page = 1) {
  return useQuery({
    queryKey: ["routes", page],
    queryFn: () => listRoutes(page).then((r) => r.data),
  })
}

export function useRoute(id: number) {
  return useQuery({
    queryKey: ["routes", id],
    queryFn: () => getRoute(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateRoute() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: RouteCreate) => createRoute(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routes"] }),
  })
}

export function useUpdateRoute(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: RouteCreate) => updateRoute(id, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routes"] }),
  })
}

export function useDeleteRoute() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteRoute(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routes"] }),
  })
}

export function useAddRouteStop(routeId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: RouteStopCreate) => addRouteStop(routeId, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routes"] }),
  })
}
