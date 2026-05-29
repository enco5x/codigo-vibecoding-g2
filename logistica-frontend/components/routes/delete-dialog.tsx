"use client"

import { useDeleteRoute } from "@/lib/hooks/use-routes"
import type { RouteList } from "@/lib/types/route"
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
  route: RouteList | null
}

export function DeleteDialog({ open, onOpenChange, route }: Props) {
  const deleteMutation = useDeleteRoute()

  const handleDelete = async () => {
    if (!route) return
    try {
      await deleteMutation.mutateAsync(route.id)
      onOpenChange(false)
    } catch {
      // handled by query client
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Eliminar ruta</DialogTitle>
          <DialogDescription>
            ¿Eliminar ruta <strong>{route?.name}</strong>? Esta acción no se puede deshacer.
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
