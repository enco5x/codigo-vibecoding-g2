"use client"

import { useState } from "react"
import { RoutesList } from "@/components/routes/routes-list"
import { RouteForm } from "@/components/routes/route-form"
import { DeleteDialog } from "@/components/routes/delete-dialog"
import type { RouteList } from "@/lib/types/route"

export default function RoutesPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<RouteList | null>(null)
  const [deleting, setDeleting] = useState<RouteList | null>(null)

  return (
    <div className="p-6">
      <RoutesList
        onCreate={() => { setEditing(null); setFormOpen(true) }}
        onEdit={(r) => { setEditing(r); setFormOpen(true) }}
        onDelete={(r) => setDeleting(r)}
      />
      <RouteForm open={formOpen} onOpenChange={setFormOpen} route={editing} />
      <DeleteDialog open={!!deleting} onOpenChange={() => setDeleting(null)} route={deleting} />
    </div>
  )
}
