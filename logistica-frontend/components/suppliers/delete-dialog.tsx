"use client"

import { useDeleteSupplier } from "@/lib/hooks/use-suppliers"
import type { SupplierList } from "@/lib/types/supplier"
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
  supplier: SupplierList | null
}

export function DeleteDialog({ open, onOpenChange, supplier }: Props) {
  const deleteMutation = useDeleteSupplier()

  const handleDelete = async () => {
    if (!supplier) return
    try {
      await deleteMutation.mutateAsync(supplier.id)
      onOpenChange(false)
    } catch {
      // handled by query client
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Eliminar proveedor</DialogTitle>
          <DialogDescription>
            ¿Eliminar proveedor <strong>{supplier?.company_name}</strong>? Esta acción no se puede deshacer.
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
