"use client"

import { useState } from "react"
import { notFound, useRouter } from "next/navigation"
import { useRoute, useDeleteRoute } from "@/lib/hooks/use-routes"
import { RouteStatusBadge } from "@/components/routes/route-status-badge"
import { RouteStops } from "@/components/routes/route-stops"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  ChevronLeft,
  Trash2,
} from "lucide-react"
import Link from "next/link"

interface Props {
  params: { id: string }
}

export default function RouteDetailPage({ params }: Props) {
  const id = Number(params.id)
  const router = useRouter()
  const { data, isLoading, isError } = useRoute(id)
  const deleteMutation = useDeleteRoute()
  const [deleting, setDeleting] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || !data) return notFound()

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta ruta? Esta acción no se puede deshacer.")) return
    setDeleting(true)
    try {
      await deleteMutation.mutateAsync(id)
      router.push("/routes")
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/routes" className="inline-flex items-center justify-center rounded-lg hover:bg-muted size-8">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{data.name}</h1>
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
                <p className="text-muted-foreground">Vehículo</p>
                <p className="font-medium">{data.transport_plate ?? "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Estado</p>
                <RouteStatusBadge status={data.status} />
              </div>
              <div>
                <p className="text-muted-foreground">Inicio estimado</p>
                <p className="font-medium">{data.estimated_start ? new Date(data.estimated_start).toLocaleString("es-CL") : "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fin estimado</p>
                <p className="font-medium">{data.estimated_end ? new Date(data.estimated_end).toLocaleString("es-CL") : "-"}</p>
              </div>
            </div>
          </div>

          <RouteStops stops={data.stops} routeId={data.id} />
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-4 space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Paradas</h2>
            <p className="text-3xl font-bold text-center">{data.stops.length}</p>
            <p className="text-sm text-muted-foreground text-center">total</p>
          </div>
        </div>
      </div>
    </div>
  )
}
