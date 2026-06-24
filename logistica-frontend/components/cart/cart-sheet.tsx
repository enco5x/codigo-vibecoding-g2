"use client"

import { useCartStore } from "@/lib/store/cart.store"
import { CartItem } from "@/components/cart/cart-item"
import { Button } from "@/components/ui/button"
import { ShoppingCart, X, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  open: boolean
  onClose: () => void
}

export function CartSheet({ open, onClose }: Props) {
  const items = useCartStore((s) => s.items)
  const getTotal = useCartStore((s) => s.getTotal)
  const getItemCount = useCartStore((s) => s.getItemCount)
  const clearCart = useCartStore((s) => s.clearCart)

  const total = getTotal()
  const itemCount = getItemCount()

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/5 bg-[#0f1729] shadow-2xl shadow-black/50 transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-medium text-white/90">Carrito</h2>
            {itemCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-500/20 px-1.5 text-[11px] font-semibold text-cyan-400">
                {itemCount}
              </span>
            )}
          </div>
          <Button variant="ghost" size="icon-xs" onClick={onClose} className="text-white/40 hover:text-white/80">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04]">
                <ShoppingCart className="h-8 w-8 text-white/20" />
              </div>
              <p className="text-sm text-white/40">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <CartItem key={item.product_id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/5 px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Total</span>
              <span className="text-lg font-semibold text-white/90">${total.toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={clearCart}
                className="text-white/40 hover:text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Vaciar
              </Button>
              <a href="/cart" className="flex-1">
                <Button className="w-full bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:bg-cyan-400 hover:shadow-cyan-400/30 active:scale-[0.98]">
                  Ver carrito
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
