"use client"

import { useDeleteDriver } from "@/lib/hooks/use-drivers"
import type { DriverList } from "@/lib/types/driver"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  driver: DriverList | null
}

export function DeleteDialog({ open, onOpenChange, driver }: Props) {
  const deleteMutation = useDeleteDriver()

  const handleDelete = async () => {
    if (!driver) return
    try {
      await deleteMutation.mutateAsync(driver.id)
      onOpenChange(false)
    } catch {
      // handled by query client
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Eliminar conductor</DialogTitle>
          <DialogDescription>
            ¿Eliminar conductor <strong>{driver?.license_number}</strong>? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deleteMutation.isPending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
