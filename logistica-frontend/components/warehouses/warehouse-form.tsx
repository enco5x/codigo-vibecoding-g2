"use client"

import { useState, useEffect } from "react"
import { useWarehouse, useCreateWarehouse, useUpdateWarehouse } from "@/lib/hooks/use-warehouses"
import type { WarehouseList, WarehouseCreate } from "@/lib/types/warehouse"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  warehouse: WarehouseList | null
}

interface FormState {
  name: string
  code: string
  address: string
  city: string
  country: string
  capacity: string
  is_active: boolean
}

const emptyForm: FormState = {
  name: "",
  code: "",
  address: "",
  city: "",
  country: "",
  capacity: "",
  is_active: true,
}

export function WarehouseForm({ open, onOpenChange, warehouse }: Props) {
  const isEditing = !!warehouse
  const { data: detail, isLoading: loadingDetail } = useWarehouse(warehouse?.id ?? 0)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState("")
  const create = useCreateWarehouse()
  const update = useUpdateWarehouse(warehouse?.id ?? 0)

  useEffect(() => {
    if (!open) return
    if (isEditing && detail) {
      setForm({
        name: detail.name,
        code: detail.code,
        address: detail.address ?? "",
        city: detail.city ?? "",
        country: detail.country ?? "",
        capacity: detail.capacity?.toString() ?? "",
        is_active: detail.is_active,
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
    const data: WarehouseCreate = {
      name: form.name,
      code: form.code,
      address: form.address || undefined,
      city: form.city || undefined,
      country: form.country || undefined,
      capacity: form.capacity ? Number(form.capacity) : null,
      is_active: form.is_active,
    }
    try {
      if (isEditing) {
        await update.mutateAsync(data)
      } else {
        await create.mutateAsync(data)
      }
      onOpenChange(false)
    } catch {
      setError("Error al guardar la bodega")
    }
  }

  const isPending = create.isPending || update.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar bodega" : "Nueva bodega"}</DialogTitle>
        </DialogHeader>
        {isEditing && loadingDetail ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-white/40" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
            <div className="space-y-1">
              <FormSection title="Información de la bodega" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input id="name" value={form.name} onChange={set("name")} required disabled={isPending} placeholder="Nombre bodega" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Código *</Label>
                  <Input id="code" value={form.code} onChange={set("code")} required disabled={isPending} placeholder="Código bodega" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Textarea id="address" value={form.address} onChange={set("address")} disabled={isPending} placeholder="Dirección completa" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" value={form.city} onChange={set("city")} disabled={isPending} placeholder="Ciudad" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input id="country" value={form.country} onChange={set("country")} disabled={isPending} placeholder="País" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacidad</Label>
                  <Input id="capacity" type="number" min={0} value={form.capacity} onChange={set("capacity")} disabled={isPending} placeholder="0" />
                </div>
                <div className="flex items-end pb-2 space-x-2">
                  <Switch
                    id="is_active"
                    checked={form.is_active}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))}
                    disabled={isPending}
                  />
                  <Label htmlFor="is_active">Activo</Label>
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
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
