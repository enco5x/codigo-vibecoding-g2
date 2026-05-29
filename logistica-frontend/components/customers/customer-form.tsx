"use client"

import { useState, useEffect } from "react"
import { useCustomer, useCreateCustomer, useUpdateCustomer } from "@/lib/hooks/use-customers"
import type { CustomerList, CustomerCreate } from "@/lib/types/customer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { FormSection } from "@/components/ui/form-section"
import { Loader2 } from "lucide-react"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: CustomerList | null
}

interface FormState {
  company_name: string
  contact_name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
}

const emptyForm: FormState = {
  company_name: "",
  contact_name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
}

export function CustomerForm({ open, onOpenChange, customer }: Props) {
  const isEditing = !!customer
  const { data: detail, isLoading: loadingDetail } = useCustomer(customer?.id ?? 0)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState("")
  const create = useCreateCustomer()
  const update = useUpdateCustomer(customer?.id ?? 0)

  useEffect(() => {
    if (!open) return
    if (isEditing && detail) {
      setForm({
        company_name: detail.company_name,
        contact_name: detail.contact_name ?? "",
        email: detail.email ?? "",
        phone: detail.phone ?? "",
        address: detail.address ?? "",
        city: detail.city ?? "",
        country: detail.country ?? "",
      })
    } else if (!isEditing) {
      setForm(emptyForm)
    }
    setError("")
  }, [detail, isEditing, open])

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const data: CustomerCreate = {
      company_name: form.company_name,
      contact_name: form.contact_name || undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
      address: form.address || undefined,
      city: form.city || undefined,
      country: form.country || undefined,
    }
    try {
      if (isEditing) {
        await update.mutateAsync(data)
      } else {
        await create.mutateAsync(data)
      }
      onOpenChange(false)
    } catch {
      setError("Error al guardar el cliente")
    }
  }

  const isPending = create.isPending || update.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar cliente" : "Nuevo cliente"}</DialogTitle>
        </DialogHeader>
        {isEditing && loadingDetail ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-white/40" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
            <div className="space-y-1">
              <FormSection title="Información de la empresa" />
              <div className="space-y-2">
                <Label htmlFor="company_name">Nombre empresa *</Label>
                <Input id="company_name" value={form.company_name} onChange={set("company_name")} required disabled={isPending} placeholder="Razón social" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_name">Nombre contacto</Label>
                  <Input id="contact_name" value={form.contact_name} onChange={set("contact_name")} disabled={isPending} placeholder="Contacto directo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={set("email")} disabled={isPending} placeholder="correo@ejemplo.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" value={form.phone} onChange={set("phone")} disabled={isPending} placeholder="+56 9 XXXX XXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" value={form.city} onChange={set("city")} disabled={isPending} placeholder="Ciudad" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <FormSection title="Dirección" />
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Textarea id="address" value={form.address} onChange={set("address")} disabled={isPending} placeholder="Dirección completa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input id="country" value={form.country} onChange={set("country")} disabled={isPending} placeholder="País" />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending} className="text-white/50 hover:text-white/80">
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 hover:shadow-cyan-400/30 active:scale-[0.98]">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
