"use client"

import { STATUS_CHOICES, type ShipmentStatus } from "@/lib/types/shipment"
import { StatusDot } from "@/components/ui/status-dot"

const variantMap: Record<ShipmentStatus, "active" | "inactive" | "pending" | "info"> = {
  pending: "pending",
  assigned: "info",
  in_transit: "info",
  delivered: "active",
  cancelled: "inactive",
}

export function StatusBadge({ status }: { status: ShipmentStatus }) {
  return (
    <StatusDot
      variant={variantMap[status] ?? "pending"}
      label={STATUS_CHOICES[status] ?? status}
    />
  )
}
