"use client"

import { useState } from "react"
import { WarehousesList } from "@/components/warehouses/warehouses-list"
import { WarehouseForm } from "@/components/warehouses/warehouse-form"
import { DeleteDialog } from "@/components/warehouses/delete-dialog"
import type { WarehouseList } from "@/lib/types/warehouse"

export default function WarehousesPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<WarehouseList | null>(null)
  const [deleting, setDeleting] = useState<WarehouseList | null>(null)

  return (
    <>
      <WarehousesList
        onCreate={() => { setEditing(null); setFormOpen(true) }}
        onEdit={(w) => { setEditing(w); setFormOpen(true) }}
        onDelete={(w) => setDeleting(w)}
      />
      <WarehouseForm open={formOpen} onOpenChange={setFormOpen} warehouse={editing} />
      <DeleteDialog open={!!deleting} onOpenChange={() => setDeleting(null)} warehouse={deleting} />
    </>
  )
}
