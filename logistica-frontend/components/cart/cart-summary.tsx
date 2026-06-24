"use client"

import { useCartStore } from "@/lib/store/cart.store"
import { useCheckout } from "@/lib/hooks/use-payments"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ShoppingCart } from "lucide-react"

export function CartSummary() {
  const items = useCartStore((s) => s.items)
  const getTotal = useCartStore((s) => s.getTotal)
  const getItemCount = useCartStore((s) => s.getItemCount)
  const clearCart = useCartStore((s) => s.clearCart)
  const checkout = useCheckout()

  const total = getTotal()
  const itemCount = getItemCount()

  const handleCheckout = () => {
    checkout.mutate(
      {
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        success_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/cancel`,
      },
      {
        onSuccess: (data) => {
          window.location.href = data.session_url
        },
      }
    )
  }

  if (items.length === 0) return null

  return (
    <Card className="border-white/5 bg-white/[0.03] backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white/90">Resumen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/50">Productos</span>
          <span className="text-white/80">{itemCount} artículos</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/50">Subtotal</span>
          <span className="text-white/80">${total.toFixed(2)}</span>
        </div>
        <hr className="border-white/5" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/80">Total</span>
          <span className="text-xl font-semibold text-white/90">${total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          onClick={handleCheckout}
          disabled={checkout.isPending}
          className="w-full bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:bg-cyan-400 hover:shadow-cyan-400/30 active:scale-[0.98]"
        >
          {checkout.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Pagar con Stripe
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={clearCart}
          className="w-full text-white/40 hover:text-red-400"
        >
          Vaciar carrito
        </Button>
      </CardFooter>
    </Card>
  )
}
