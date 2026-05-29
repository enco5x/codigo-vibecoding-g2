"use client"

import { useState } from "react"
import { DriversList } from "@/components/drivers/drivers-list"
import { DriverForm } from "@/components/drivers/driver-form"
import { DeleteDialog } from "@/components/drivers/delete-dialog"
import type { DriverList } from "@/lib/types/driver"

export default function DriversPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<DriverList | null>(null)
  const [deleting, setDeleting] = useState<DriverList | null>(null)

  return (
    <>
      <DriversList
        onCreate={() => { setEditing(null); setFormOpen(true) }}
        onEdit={(d) => { setEditing(d); setFormOpen(true) }}
        onDelete={(d) => setDeleting(d)}
      />
      <DriverForm open={formOpen} onOpenChange={setFormOpen} driver={editing} />
      <DeleteDialog open={!!deleting} onOpenChange={() => setDeleting(null)} driver={deleting} />
    </>
  )
}
