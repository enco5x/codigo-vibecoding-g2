"use client"

import { useState } from "react"
import { ShipmentsList } from "@/components/shipments/shipments-list"
import { ShipmentForm } from "@/components/shipments/shipment-form"
import { DeleteDialog } from "@/components/shipments/delete-dialog"
import type { ShipmentList } from "@/lib/types/shipment"

export default function ShipmentsPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ShipmentList | null>(null)
  const [deleting, setDeleting] = useState<ShipmentList | null>(null)

  return (
    <>
      <ShipmentsList
        onCreate={() => { setEditing(null); setFormOpen(true) }}
        onDelete={(s) => setDeleting(s)}
      />
      <ShipmentForm open={formOpen} onOpenChange={setFormOpen} shipment={editing} />
      <DeleteDialog open={!!deleting} onOpenChange={() => setDeleting(null)} shipment={deleting} />
    </>
  )
}
