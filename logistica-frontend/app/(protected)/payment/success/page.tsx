"use client"

import { useEffect } from "react"
import { useCartStore } from "@/lib/store/cart.store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="flex items-center justify-center py-20">
      <Card className="w-full max-w-md border-white/5 bg-white/[0.03] backdrop-blur-md">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-xl font-semibold text-white/90">¡Pago exitoso!</h1>
          <p className="text-sm text-white/50">
            Tu pago ha sido procesado correctamente. Recibirás un email de confirmación en breve.
          </p>
          <Link href="/cart">
            <Button className="mt-2 bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:bg-cyan-400 hover:shadow-cyan-400/30 active:scale-[0.98]">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Seguir comprando
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
