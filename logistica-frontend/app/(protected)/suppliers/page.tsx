"use client"

import { useState } from "react"
import { SuppliersList } from "@/components/suppliers/suppliers-list"
import { SupplierForm } from "@/components/suppliers/supplier-form"
import { DeleteDialog } from "@/components/suppliers/delete-dialog"
import type { SupplierList } from "@/lib/types/supplier"

export default function SuppliersPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<SupplierList | null>(null)
  const [deleting, setDeleting] = useState<SupplierList | null>(null)

  return (
    <div className="p-6">
      <SuppliersList
        onCreate={() => { setEditing(null); setFormOpen(true) }}
        onEdit={(s) => { setEditing(s); setFormOpen(true) }}
        onDelete={(s) => setDeleting(s)}
      />
      <SupplierForm open={formOpen} onOpenChange={setFormOpen} supplier={editing} />
      <DeleteDialog open={!!deleting} onOpenChange={() => setDeleting(null)} supplier={deleting} />
    </div>
  )
}
