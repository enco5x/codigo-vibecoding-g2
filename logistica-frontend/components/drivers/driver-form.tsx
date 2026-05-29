"use client"

import { useState, useEffect } from "react"
import { useDriver, useCreateDriver, useUpdateDriver } from "@/lib/hooks/use-drivers"
import type { DriverList, DriverCreate } from "@/lib/types/driver"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  driver: DriverList | null
}

interface FormState {
  license_number: string
  phone: string
  email: string
  is_available: boolean
}

const emptyForm: FormState = {
  license_number: "",
  phone: "",
  email: "",
  is_available: true,
}

export function DriverForm({ open, onOpenChange, driver }: Props) {
  const isEditing = !!driver
  const { data: detail, isLoading: loadingDetail } = useDriver(driver?.id ?? 0)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState("")
  const create = useCreateDriver()
  const update = useUpdateDriver(driver?.id ?? 0)

  useEffect(() => {
    if (!open) return
    if (isEditing && detail) {
      setForm({
        license_number: detail.license_number,
        phone: detail.phone ?? "",
        email: detail.email ?? "",
        is_available: detail.is_available,
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
    const data: DriverCreate = {
      license_number: form.license_number,
      phone: form.phone || undefined,
      email: form.email || undefined,
      is_available: form.is_available,
    }
    try {
      if (isEditing) {
        await update.mutateAsync(data)
      } else {
        await create.mutateAsync(data)
      }
      onOpenChange(false)
    } catch {
      setError("Error al guardar el conductor")
    }
  }

  const isPending = create.isPending || update.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar conductor" : "Nuevo conductor"}</DialogTitle>
        </DialogHeader>
        {isEditing && loadingDetail ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-white/40" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
            <div className="space-y-1">
              <FormSection title="Información del conductor" />
              <div className="space-y-2">
                <Label htmlFor="license_number">Licencia *</Label>
                <Input id="license_number" value={form.license_number} onChange={set("license_number")} required disabled={isPending} placeholder="Número de licencia" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" value={form.phone} onChange={set("phone")} disabled={isPending} placeholder="+56 9 XXXX XXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={set("email")} disabled={isPending} placeholder="correo@ejemplo.com" />
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
