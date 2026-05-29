"use client"

import { useState, useEffect } from "react"
import { useShipment, useCreateShipment, useUpdateShipment } from "@/lib/hooks/use-shipments"
import { useCustomers } from "@/lib/hooks/use-customers"
import { useWarehouses } from "@/lib/hooks/use-warehouses"
import type { ShipmentList, ShipmentCreate } from "@/lib/types/shipment"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
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
  shipment: ShipmentList | null
}

interface FormState {
  customer: string
  warehouse: string
  origin_address: string
  destination_address: string
  destination_city: string
  destination_country: string
  scheduled_pickup: string
  scheduled_delivery: string
  weight_kg: string
  notes: string
}

const emptyForm: FormState = {
  customer: "",
  warehouse: "",
  origin_address: "",
  destination_address: "",
  destination_city: "",
  destination_country: "",
  scheduled_pickup: "",
  scheduled_delivery: "",
  weight_kg: "",
  notes: "",
}

export function ShipmentForm({ open, onOpenChange, shipment }: Props) {
  const isEditing = !!shipment
  const { data: detail, isLoading: loadingDetail } = useShipment(shipment?.id ?? 0)
  const { data: customersData } = useCustomers(1)
  const { data: warehousesData } = useWarehouses(1)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState("")
  const create = useCreateShipment()
  const update = useUpdateShipment(shipment?.id ?? 0)

  useEffect(() => {
    if (!open) return
    if (isEditing && detail) {
      setForm({
        customer: detail.customer.id.toString(),
        warehouse: detail.warehouse?.id.toString() ?? "",
        origin_address: detail.origin_address ?? "",
        destination_address: detail.destination_address,
        destination_city: detail.destination_city,
        destination_country: detail.destination_country,
        scheduled_pickup: detail.scheduled_pickup ?? "",
        scheduled_delivery: detail.scheduled_delivery ?? "",
        weight_kg: detail.weight_kg ?? "",
        notes: detail.notes ?? "",
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
    const data: ShipmentCreate = {
      customer: Number(form.customer),
      warehouse: form.warehouse ? Number(form.warehouse) : null,
      origin_address: form.origin_address || undefined,
      destination_address: form.destination_address,
      destination_city: form.destination_city,
      destination_country: form.destination_country,
      scheduled_pickup: form.scheduled_pickup || null,
      scheduled_delivery: form.scheduled_delivery || null,
      weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
      notes: form.notes || undefined,
    }
    try {
      if (isEditing) {
        await update.mutateAsync(data)
      } else {
        await create.mutateAsync(data)
      }
      onOpenChange(false)
    } catch {
      setError("Error al guardar el envío")
    }
  }

  const isPending = create.isPending || update.isPending
  const customers = customersData?.results ?? []
  const warehouses = warehousesData?.results ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar envío" : "Nuevo envío"}</DialogTitle>
        </DialogHeader>
        {isEditing && loadingDetail ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-white/40" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
            <div className="space-y-1">
              <FormSection title="Asignación" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Cliente *</Label>
                  <Select id="customer" value={form.customer} onChange={(e) => setForm((prev) => ({ ...prev, customer: e.target.value }))} required disabled={isPending}>
                    <option value="">Seleccionar...</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.company_name}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warehouse">Bodega</Label>
                  <Select id="warehouse" value={form.warehouse} onChange={(e) => setForm((prev) => ({ ...prev, warehouse: e.target.value }))} disabled={isPending}>
                    <option value="">Seleccionar...</option>
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <FormSection title="Direcciones" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin_address">Dirección origen</Label>
                  <Input id="origin_address" value={form.origin_address} onChange={set("origin_address")} disabled={isPending} placeholder="Dirección de recogida" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination_address">Dirección destino *</Label>
                  <Input id="destination_address" value={form.destination_address} onChange={set("destination_address")} required disabled={isPending} placeholder="Dirección de entrega" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination_city">Ciudad destino *</Label>
                  <Input id="destination_city" value={form.destination_city} onChange={set("destination_city")} required disabled={isPending} placeholder="Ciudad" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination_country">País destino *</Label>
                  <Input id="destination_country" value={form.destination_country} onChange={set("destination_country")} required disabled={isPending} placeholder="País" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <FormSection title="Fechas y peso" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduled_pickup">Recogida programada</Label>
                  <Input id="scheduled_pickup" type="datetime-local" value={form.scheduled_pickup} onChange={set("scheduled_pickup")} disabled={isPending} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduled_delivery">Entrega programada</Label>
                  <Input id="scheduled_delivery" type="datetime-local" value={form.scheduled_delivery} onChange={set("scheduled_delivery")} disabled={isPending} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight_kg">Peso (kg)</Label>
                  <Input id="weight_kg" type="number" step="0.01" min="0" value={form.weight_kg} onChange={set("weight_kg")} disabled={isPending} placeholder="0.00" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea id="notes" value={form.notes} onChange={set("notes")} disabled={isPending} placeholder="Notas adicionales" />
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
