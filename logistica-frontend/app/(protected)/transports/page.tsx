"use client"

import { useState } from "react"
import { TransportsList } from "@/components/transports/transports-list"
import { TransportForm } from "@/components/transports/transport-form"
import { DeleteDialog } from "@/components/transports/delete-dialog"
import type { TransportList } from "@/lib/types/transport"

export default function TransportsPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<TransportList | null>(null)
  const [deleting, setDeleting] = useState<TransportList | null>(null)

  return (
    <>
      <TransportsList
        onCreate={() => { setEditing(null); setFormOpen(true) }}
        onEdit={(t) => { setEditing(t); setFormOpen(true) }}
        onDelete={(t) => setDeleting(t)}
      />
      <TransportForm open={formOpen} onOpenChange={setFormOpen} transport={editing} />
      <DeleteDialog open={!!deleting} onOpenChange={() => setDeleting(null)} transport={deleting} />
    </>
  )
}
