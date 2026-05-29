"use client"

import { ROUTE_STATUS_CHOICES, type RouteStatus } from "@/lib/types/route"
import { StatusDot } from "@/components/ui/status-dot"

const variantMap: Record<RouteStatus, "active" | "inactive" | "pending" | "info"> = {
  pending: "pending",
  in_progress: "info",
  completed: "active",
}

export function RouteStatusBadge({ status }: { status: RouteStatus }) {
  return (
    <StatusDot
      variant={variantMap[status] ?? "pending"}
      label={ROUTE_STATUS_CHOICES[status] ?? status}
    />
  )
}
