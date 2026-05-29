"use client"

import { useState, useEffect } from "react"
import { useTransport, useCreateTransport, useUpdateTransport } from "@/lib/hooks/use-transports"
import { useDrivers } from "@/lib/hooks/use-drivers"
import type { TransportList, TransportCreate } from "@/lib/types/transport"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
  transport: TransportList | null
}

interface FormState {
  plate_number: string
  vehicle_type: string
  vehicle_model: string
  capacity_kg: string
  is_available: boolean
  driver: string
}

const emptyForm: FormState = {
  plate_number: "",
  vehicle_type: "",
  vehicle_model: "",
  capacity_kg: "",
  is_available: true,
  driver: "",
}

export function TransportForm({ open, onOpenChange, transport }: Props) {
  const isEditing = !!transport
  const { data: detail, isLoading: loadingDetail } = useTransport(transport?.id ?? 0)
  const { data: driversData } = useDrivers(1)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState("")
  const create = useCreateTransport()
  const update = useUpdateTransport(transport?.id ?? 0)

  useEffect(() => {
    if (!open) return
    if (isEditing && detail) {
      setForm({
        plate_number: detail.plate_number,
        vehicle_type: detail.vehicle_type ?? "",
        vehicle_model: detail.vehicle_model ?? "",
        capacity_kg: detail.capacity_kg ?? "",
        is_available: detail.is_available,
        driver: detail.driver?.toString() ?? "",
      })
    } else if (!isEditing) {
      setForm(emptyForm)
    }
    setError("")
  }, [detail, isEditing, open])

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const data: TransportCreate = {
      plate_number: form.plate_number,
      vehicle_type: form.vehicle_type || undefined,
      vehicle_model: form.vehicle_model || undefined,
      capacity_kg: form.capacity_kg ? Number(form.capacity_kg) : null,
      is_available: form.is_available,
      driver: form.driver ? Number(form.driver) : null,
    }
    try {
      if (isEditing) {
        await update.mutateAsync(data)
      } else {
        await create.mutateAsync(data)
      }
      onOpenChange(false)
    } catch {
      setError("Error al guardar el vehículo")
    }
  }

  const isPending = create.isPending || update.isPending
  const drivers = driversData?.results ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar vehículo" : "Nuevo vehículo"}</DialogTitle>
        </DialogHeader>
        {isEditing && loadingDetail ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-white/40" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
            <div className="space-y-1">
              <FormSection title="Información del vehículo" />
              <div className="space-y-2">
                <Label htmlFor="plate_number">Placa *</Label>
                <Input id="plate_number" value={form.plate_number} onChange={set("plate_number")} required disabled={isPending} placeholder="Número de placa" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle_type">Tipo</Label>
                  <Input id="vehicle_type" value={form.vehicle_type} onChange={set("vehicle_type")} disabled={isPending} placeholder="Tipo de vehículo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle_model">Modelo</Label>
                  <Input id="vehicle_model" value={form.vehicle_model} onChange={set("vehicle_model")} disabled={isPending} placeholder="Modelo" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity_kg">Capacidad (kg)</Label>
                  <Input id="capacity_kg" type="number" step="0.01" min="0" value={form.capacity_kg} onChange={set("capacity_kg")} disabled={isPending} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver">Conductor</Label>
                  <Select id="driver" value={form.driver} onChange={(e) => setForm((prev) => ({ ...prev, driver: e.target.value }))} disabled={isPending}>
                    <option value="">Seleccionar...</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>{d.license_number}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_available"
                checked={form.is_available}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_available: checked }))}
                disabled={isPending}
              />
              <Label htmlFor="is_available">Disponible</Label>
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
