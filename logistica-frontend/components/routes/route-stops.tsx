"use client"

import { useState } from "react"
import { useAddRouteStop } from "@/lib/hooks/use-routes"
import type { RouteStopDetail } from "@/lib/types/route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2, Plus } from "lucide-react"

interface Props {
  stops: RouteStopDetail[]
  routeId: number
}

export function RouteStops({ stops, routeId }: Props) {
  const [addOpen, setAddOpen] = useState(false)
  const [order, setOrder] = useState((stops.length + 1).toString())
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [estimatedArrival, setEstimatedArrival] = useState("")
  const [notes, setNotes] = useState("")
  const addStop = useAddRouteStop(routeId)

  const handleAdd = async () => {
    if (!order) return
    try {
      await addStop.mutateAsync({
        order: Number(order),
        address: address || undefined,
        city: city || undefined,
        estimated_arrival: estimatedArrival || null,
        notes: notes || undefined,
      })
      setAddOpen(false)
      setOrder((stops.length + 2).toString())
      setAddress("")
      setCity("")
      setEstimatedArrival("")
      setNotes("")
    } catch {
      // handled
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Paradas</h3>
        <Button size="sm" variant="outline" onClick={() => setAddOpen(true)}>
          <Plus className="mr-1 h-3 w-3" />
          Agregar parada
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead>LLegada</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stops.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Sin paradas
                </TableCell>
              </TableRow>
            ) : (
              [...stops]
                .sort((a, b) => a.order - b.order)
                .map((stop) => (
                  <TableRow key={stop.id}>
                    <TableCell className="font-medium">{stop.order}</TableCell>
                    <TableCell>{stop.address ?? "-"}</TableCell>
                    <TableCell>{stop.city ?? "-"}</TableCell>
                    <TableCell>
                      {stop.estimated_arrival
                        ? new Date(stop.estimated_arrival).toLocaleDateString("es-CL")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          stop.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : stop.status === "arrived"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {stop.status === "completed"
                          ? "Completada"
                          : stop.status === "arrived"
                            ? "Llegó"
                            : "Pendiente"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Agregar parada</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stop_order">Orden *</Label>
              <Input id="stop_order" type="number" min="1" value={order} onChange={(e) => setOrder(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stop_address">Dirección</Label>
              <Input id="stop_address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stop_city">Ciudad</Label>
                <Input id="stop_city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stop_arrival">LLegada estimada</Label>
                <Input id="stop_arrival" type="datetime-local" value={estimatedArrival} onChange={(e) => setEstimatedArrival(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stop_notes">Notas</Label>
              <Input id="stop_notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={addStop.isPending}>
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={addStop.isPending || !order}>
              {addStop.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
