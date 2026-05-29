"use client"

import { useState } from "react"
import { CustomersList } from "@/components/customers/customers-list"
import { CustomerForm } from "@/components/customers/customer-form"
import { DeleteDialog } from "@/components/customers/delete-dialog"
import type { CustomerList } from "@/lib/types/customer"

export default function CustomersPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<CustomerList | null>(null)
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerList | null>(null)

  const handleCreate = () => {
    setEditingCustomer(null)
    setFormOpen(true)
  }

  const handleEdit = (customer: CustomerList) => {
    setEditingCustomer(customer)
    setFormOpen(true)
  }

  const handleDelete = (customer: CustomerList) => {
    setDeletingCustomer(customer)
  }

  return (
    <>
      <CustomersList
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <CustomerForm
        open={formOpen}
        onOpenChange={setFormOpen}
        customer={editingCustomer}
      />
      <DeleteDialog
        open={!!deletingCustomer}
        onOpenChange={() => setDeletingCustomer(null)}
        customer={deletingCustomer}
      />
    </>
  )
}
