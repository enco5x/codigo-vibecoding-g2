"use client"

import { useState, useEffect } from "react"
import { useRoute, useCreateRoute, useUpdateRoute } from "@/lib/hooks/use-routes"
import { useTransports } from "@/lib/hooks/use-transports"
import type { RouteList, RouteCreate } from "@/lib/types/route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  route: RouteList | null
}

interface FormState {
  name: string
  transport: string
  estimated_start: string
  estimated_end: string
}

const emptyForm: FormState = {
  name: "",
  transport: "",
  estimated_start: "",
  estimated_end: "",
}

export function RouteForm({ open, onOpenChange, route }: Props) {
  const isEditing = !!route
  const { data: detail, isLoading: loadingDetail } = useRoute(route?.id ?? 0)
  const { data: transportsData } = useTransports(1)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState("")
  const create = useCreateRoute()
  const update = useUpdateRoute(route?.id ?? 0)

  useEffect(() => {
    if (!open) return
    if (isEditing && detail) {
      setForm({
        name: detail.name,
        transport: detail.transport?.toString() ?? "",
        estimated_start: detail.estimated_start ?? "",
        estimated_end: detail.estimated_end ?? "",
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
    const data: RouteCreate = {
      name: form.name,
      transport: form.transport ? Number(form.transport) : null,
      estimated_start: form.estimated_start || null,
      estimated_end: form.estimated_end || null,
    }
    try {
      if (isEditing) {
        await update.mutateAsync(data)
      } else {
        await create.mutateAsync(data)
      }
      onOpenChange(false)
    } catch {
      setError("Error al guardar la ruta")
    }
  }

  const isPending = create.isPending || update.isPending
  const transports = transportsData?.results ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar ruta" : "Nueva ruta"}</DialogTitle>
        </DialogHeader>
        {isEditing && loadingDetail ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-white/40" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
            <div className="space-y-1">
              <FormSection title="Información de la ruta" />
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input id="name" value={form.name} onChange={set("name")} required disabled={isPending} placeholder="Nombre ruta" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transport">Vehículo</Label>
                <Select id="transport" value={form.transport} onChange={(e) => setForm((prev) => ({ ...prev, transport: e.target.value }))} disabled={isPending}>
                  <option value="">Seleccionar...</option>
                  {transports.map((t) => (
                    <option key={t.id} value={t.id}>{t.plate_number} ({t.vehicle_type ?? t.vehicle_model ?? "sin tipo"})</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <FormSection title="Fechas estimadas" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimated_start">Inicio estimado</Label>
                  <Input id="estimated_start" type="datetime-local" value={form.estimated_start} onChange={set("estimated_start")} disabled={isPending} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated_end">Fin estimado</Label>
                  <Input id="estimated_end" type="datetime-local" value={form.estimated_end} onChange={set("estimated_end")} disabled={isPending} />
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
