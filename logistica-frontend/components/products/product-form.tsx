"use client"

import { useState, useEffect } from "react"
import { useProduct, useCreateProduct, useUpdateProduct } from "@/lib/hooks/use-products"
import { useSuppliers } from "@/lib/hooks/use-suppliers"
import { useWarehouses } from "@/lib/hooks/use-warehouses"
import type { ProductList, ProductCreate } from "@/lib/types/product"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  product: ProductList | null
}

interface FormState {
  sku: string
  name: string
  description: string
  category: string
  unit_price: string
  supplier: string
  warehouse: string
  stock_quantity: string
  weight_kg: string
  dimensions: string
  is_active: boolean
}

const emptyForm: FormState = {
  sku: "",
  name: "",
  description: "",
  category: "",
  unit_price: "",
  supplier: "",
  warehouse: "",
  stock_quantity: "0",
  weight_kg: "",
  dimensions: "",
  is_active: true,
}

export function ProductForm({ open, onOpenChange, product }: Props) {
  const isEditing = !!product
  const { data: detail, isLoading: loadingDetail } = useProduct(product?.id ?? 0)
  const { data: suppliersData } = useSuppliers(1)
  const { data: warehousesData } = useWarehouses(1)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState("")
  const create = useCreateProduct()
  const update = useUpdateProduct(product?.id ?? 0)

  useEffect(() => {
    if (!open) return
    if (isEditing && detail) {
      setForm({
        sku: detail.sku,
        name: detail.name,
        description: detail.description ?? "",
        category: detail.category ?? "",
        unit_price: detail.unit_price,
        supplier: detail.supplier?.toString() ?? "",
        warehouse: detail.warehouse?.toString() ?? "",
        stock_quantity: detail.stock_quantity.toString(),
        weight_kg: detail.weight_kg ?? "",
        dimensions: detail.dimensions ?? "",
        is_active: detail.is_active,
      })
    } else if (!isEditing) {
      setForm(emptyForm)
    }
    setError("")
  }, [detail, isEditing, open])

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const data: ProductCreate = {
      sku: form.sku,
      name: form.name,
      description: form.description || undefined,
      category: form.category || undefined,
      unit_price: form.unit_price,
      supplier: form.supplier ? Number(form.supplier) : null,
      warehouse: form.warehouse ? Number(form.warehouse) : null,
      stock_quantity: form.stock_quantity ? Number(form.stock_quantity) : 0,
      weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
      dimensions: form.dimensions || undefined,
      is_active: form.is_active,
    }
    try {
      if (isEditing) {
        await update.mutateAsync(data)
      } else {
        await create.mutateAsync(data)
      }
      onOpenChange(false)
    } catch {
      setError("Error al guardar el producto")
    }
  }

  const isPending = create.isPending || update.isPending
  const suppliers = suppliersData?.results ?? []
  const warehouses = warehousesData?.results ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar producto" : "Nuevo producto"}</DialogTitle>
        </DialogHeader>
        {isEditing && loadingDetail ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-white/40" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
            <div className="space-y-1">
              <FormSection title="Información básica" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input id="sku" value={form.sku} onChange={set("sku")} required disabled={isPending} placeholder="Código SKU" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input id="name" value={form.name} onChange={set("name")} required disabled={isPending} placeholder="Nombre producto" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" value={form.description} onChange={set("description")} disabled={isPending} placeholder="Descripción del producto" />
              </div>
            </div>

            <div className="space-y-1">
              <FormSection title="Precio y stock" />
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Input id="category" value={form.category} onChange={set("category")} disabled={isPending} placeholder="Categoría" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit_price">Precio *</Label>
                  <Input id="unit_price" type="number" step="0.01" min="0" value={form.unit_price} onChange={set("unit_price")} required disabled={isPending} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Stock</Label>
                  <Input id="stock_quantity" type="number" min="0" value={form.stock_quantity} onChange={set("stock_quantity")} disabled={isPending} placeholder="0" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <FormSection title="Asignación" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Proveedor</Label>
                  <Select id="supplier" value={form.supplier} onChange={(e) => setForm((prev) => ({ ...prev, supplier: e.target.value }))} disabled={isPending}>
                    <option value="">Seleccionar...</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.company_name}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warehouse">Bodega</Label>
                  <Select id="warehouse" value={form.warehouse} onChange={(e) => setForm((prev) => ({ ...prev, warehouse: e.target.value }))} disabled={isPending}>
                    <option value="">Seleccionar...</option>
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <FormSection title="Especificaciones" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight_kg">Peso (kg)</Label>
                  <Input id="weight_kg" type="number" step="0.01" min="0" value={form.weight_kg} onChange={set("weight_kg")} disabled={isPending} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensiones</Label>
                  <Input id="dimensions" value={form.dimensions} onChange={set("dimensions")} disabled={isPending} placeholder="ej: 30x20x10 cm" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))}
                disabled={isPending}
              />
              <Label htmlFor="is_active">Activo</Label>
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
