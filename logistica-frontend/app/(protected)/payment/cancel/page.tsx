"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { XCircle, ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PaymentCancelPage() {
  return (
    <div className="flex items-center justify-center py-20">
      <Card className="w-full max-w-md border-white/5 bg-white/[0.03] backdrop-blur-md">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
            <XCircle className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="text-xl font-semibold text-white/90">Pago cancelado</h1>
          <p className="text-sm text-white/50">
            El pago no fue procesado. Tu carrito sigue disponible para que completes la compra.
          </p>
          <div className="flex gap-2">
            <Link href="/cart">
              <Button variant="outline" className="border-white/10 text-white/70 hover:bg-white/[0.04]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al carrito
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
