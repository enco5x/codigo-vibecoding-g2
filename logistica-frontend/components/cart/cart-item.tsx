"use client"

import type { CartItem as CartItemType } from "@/lib/types/payment"
import { useCartStore } from "@/lib/store/cart.store"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, Package } from "lucide-react"

interface Props {
  item: CartItemType
}

export function CartItem({ item }: Props) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  const subtotal = parseFloat(item.unit_price) * item.quantity

  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.05]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
        <Package className="h-5 w-5 text-cyan-400/60" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white/90">{item.name}</p>
        <p className="text-xs text-white/40">${item.unit_price} c/u</p>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
          className="text-white/40 hover:text-white/80"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center text-sm text-white/80">{item.quantity}</span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
          disabled={item.quantity >= item.stock_quantity}
          className="text-white/40 hover:text-white/80"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <span className="w-16 text-right text-sm font-medium text-white/80">${subtotal.toFixed(2)}</span>

      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => removeItem(item.product_id)}
        className="text-white/30 hover:text-red-400"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
