"use client"

import { useState } from "react"
import { useAddShipmentItem } from "@/lib/hooks/use-shipments"
import { useProducts } from "@/lib/hooks/use-products"
import type { ShipmentItemDetail } from "@/lib/types/shipment"
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
  items: ShipmentItemDetail[]
  shipmentId: number
}

export function ShipmentItems({ items, shipmentId }: Props) {
  const [addOpen, setAddOpen] = useState(false)
  const [product, setProduct] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [unitPrice, setUnitPrice] = useState("")
  const { data: productsData } = useProducts(1)
  const addItem = useAddShipmentItem(shipmentId)

  const handleAdd = async () => {
    if (!product || !quantity || !unitPrice) return
    try {
      await addItem.mutateAsync({
        product: Number(product),
        quantity: Number(quantity),
        unit_price: unitPrice,
      })
      setAddOpen(false)
      setProduct("")
      setQuantity("1")
      setUnitPrice("")
    } catch {
      // error handled by query client
    }
  }

  const products = productsData?.results?.filter((p) => p.is_active && p.stock_quantity > 0) ?? []

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Ítems</h3>
        <Button size="sm" variant="outline" onClick={() => setAddOpen(true)}>
          <Plus className="mr-1 h-3 w-3" />
          Agregar ítem
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Precio unit.</TableHead>
              <TableHead>Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Sin ítems
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.unit_price}</TableCell>
                  <TableCell>${(Number(item.unit_price) * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Agregar ítem</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item_product">Producto *</Label>
              <select
                id="item_product"
                value={product}
                onChange={(e) => {
                  const p = products.find((x) => x.id.toString() === e.target.value)
                  setProduct(e.target.value)
                  if (p) setUnitPrice(p.unit_price)
                }}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                <option value="">Seleccionar...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.sku} — {p.name} (${p.unit_price})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item_qty">Cantidad *</Label>
                <Input id="item_qty" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item_price">Precio unit. *</Label>
                <Input id="item_price" type="number" step="0.01" min="0" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={addItem.isPending}>
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={addItem.isPending || !product || !quantity || !unitPrice}>
              {addItem.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
