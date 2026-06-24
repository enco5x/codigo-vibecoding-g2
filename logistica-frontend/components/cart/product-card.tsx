"use client"

import type { ProductList } from "@/lib/types/product"
import { useCartStore } from "@/lib/store/cart.store"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check, Package } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  product: ProductList
}

export function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const items = useCartStore((s) => s.items)
  const inCart = items.find((i) => i.product_id === product.id)

  const handleAdd = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      sku: product.sku,
      unit_price: product.unit_price,
      stock_quantity: product.stock_quantity,
    })
  }

  const outOfStock = product.stock_quantity <= 0 || !product.is_active

  return (
    <Card className="group overflow-hidden border-white/5 bg-white/[0.03] backdrop-blur-md transition-all duration-200 hover:border-cyan-500/20 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-cyan-500/5">
      <div className="flex items-center justify-center bg-gradient-to-br from-cyan-500/10 to-blue-500/5 px-6 py-8">
        <Package className="h-12 w-12 text-cyan-400/40 transition-colors group-hover:text-cyan-400/60" />
      </div>
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-white/90">{product.name}</h3>
        </div>
        <p className="text-xs text-white/40">{product.sku}</p>
        {product.category && (
          <span className="inline-block rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400">
            {product.category}
          </span>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-semibold text-white/90">${product.unit_price}</span>
          <span className={cn("text-xs", product.stock_quantity > 0 ? "text-white/40" : "text-red-400")}>
            {product.stock_quantity > 0 ? `${product.stock_quantity} en stock` : "Agotado"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="border-t border-white/5">
        <Button
          onClick={handleAdd}
          disabled={outOfStock}
          className={cn(
            "w-full transition-all duration-200 active:scale-[0.98]",
            inCart
              ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
              : "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 hover:shadow-cyan-400/30"
          )}
          variant={inCart ? "outline" : "default"}
        >
          {inCart ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              En carrito ({inCart.quantity})
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Agregar
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
