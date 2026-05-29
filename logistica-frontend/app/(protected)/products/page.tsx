"use client"

import { useState } from "react"
import { ProductsList } from "@/components/products/products-list"
import { ProductForm } from "@/components/products/product-form"
import { DeleteDialog } from "@/components/products/delete-dialog"
import type { ProductList } from "@/lib/types/product"

export default function ProductsPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ProductList | null>(null)
  const [deleting, setDeleting] = useState<ProductList | null>(null)

  return (
    <div className="p-6">
      <ProductsList
        onCreate={() => { setEditing(null); setFormOpen(true) }}
        onEdit={(p) => { setEditing(p); setFormOpen(true) }}
        onDelete={(p) => setDeleting(p)}
      />
      <ProductForm open={formOpen} onOpenChange={setFormOpen} product={editing} />
      <DeleteDialog open={!!deleting} onOpenChange={() => setDeleting(null)} product={deleting} />
    </div>
  )
}
