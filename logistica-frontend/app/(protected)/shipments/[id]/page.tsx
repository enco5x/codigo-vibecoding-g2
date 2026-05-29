"use client"

import { useState } from "react"
import { notFound, useRouter } from "next/navigation"
import { useShipment, useUpdateShipmentStatus } from "@/lib/hooks/use-shipments"
import { useDeleteShipment } from "@/lib/hooks/use-shipments"
import { StatusBadge } from "@/components/shipments/status"
import { ShipmentItems } from "@/components/shipments/shipment-items"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Loader2,
  ChevronLeft,
  Trash2,
} from "lucide-react"
import Link from "next/link"

interface Props {
  params: { id: string }
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pendiente" },
  { value: "assigned", label: "Asignado" },
  { value: "in_transit", label: "En tránsito" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
]

export default function ShipmentDetailPage({ params }: Props) {
  const id = Number(params.id)
  const router = useRouter()
  const { data, isLoading, isError } = useShipment(id)
  const statusMutation = useUpdateShipmentStatus(id)
  const deleteMutation = useDeleteShipment()
  const [deleting, setDeleting] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || !data) return notFound()

  const handleStatusChange = async (newStatus: string) => {
    try {
      await statusMutation.mutateAsync(newStatus)
    } catch {
      // handled
    }
  }

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este envío? Esta acción no se puede deshacer.")) return
    setDeleting(true)
    try {
      await deleteMutation.mutateAsync(id)
      router.push("/shipments")
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/shipments" className="inline-flex items-center justify-center rounded-lg hover:bg-muted size-8">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{data.tracking_number}</h1>
            <p className="text-sm text-muted-foreground">Creado {new Date(data.created_at).toLocaleDateString("es-CL")}</p>
          </div>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
          {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
          Eliminar
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="rounded-lg border p-4 space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Información</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Cliente</p>
                <p className="font-medium">{data.customer.company_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Bodega</p>
                <p className="font-medium">{data.warehouse ? `${data.warehouse.name} (${data.warehouse.code})` : "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Origen</p>
                <p className="font-medium">{data.origin_address ?? "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Destino</p>
                <p className="font-medium">{data.destination_address}, {data.destination_city}, {data.destination_country}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Recogida</p>
                <p className="font-medium">{data.scheduled_pickup ? new Date(data.scheduled_pickup).toLocaleString("es-CL") : "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Entrega</p>
                <p className="font-medium">{data.scheduled_delivery ? new Date(data.scheduled_delivery).toLocaleString("es-CL") : "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Peso</p>
                <p className="font-medium">{data.weight_kg ? `${data.weight_kg} kg` : "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Costo</p>
                <p className="font-medium">${data.shipping_cost}</p>
              </div>
            </div>
            {data.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notas</p>
                <p className="text-sm">{data.notes}</p>
              </div>
            )}
          </div>

          <ShipmentItems items={data.items} shipmentId={data.id} />
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-4 space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Estado</h2>
            <div className="flex justify-center py-2">
              <StatusBadge status={data.status} />
            </div>
            {data.status !== "delivered" && data.status !== "cancelled" && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Cambiar estado</Label>
                <select
                  value={data.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={statusMutation.isPending}
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} disabled={opt.value === data.status}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
