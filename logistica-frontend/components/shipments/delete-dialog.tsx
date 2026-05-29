"use client"

import { useDeleteShipment } from "@/lib/hooks/use-shipments"
import type { ShipmentList } from "@/lib/types/shipment"
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
  shipment: ShipmentList | null
}

export function DeleteDialog({ open, onOpenChange, shipment }: Props) {
  const deleteMutation = useDeleteShipment()

  const handleDelete = async () => {
    if (!shipment) return
    try {
      await deleteMutation.mutateAsync(shipment.id)
      onOpenChange(false)
    } catch {
      // handled by query client
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Eliminar envío</DialogTitle>
          <DialogDescription>
            ¿Eliminar envío <strong>{shipment?.tracking_number}</strong>? Esta acción no se puede deshacer.
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
