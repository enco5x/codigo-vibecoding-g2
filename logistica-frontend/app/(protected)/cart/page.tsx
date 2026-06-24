"use client"

import { useProducts } from "@/lib/hooks/use-products"
import { useCartStore } from "@/lib/store/cart.store"
import { ProductCard } from "@/components/cart/product-card"
import { CartItem } from "@/components/cart/cart-item"
import { CartSummary } from "@/components/cart/cart-summary"
import { Loader2, ShoppingCart, Search } from "lucide-react"
import { useState } from "react"

export default function CartPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const { data, isLoading, isError } = useProducts(page)
  const cartItems = useCartStore((s) => s.items)

  const products = data?.results?.filter((p) => p.is_active) ?? []

  const filteredProducts = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase())
      )
    : products

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white/90">Tienda</h1>
          <p className="text-sm text-white/40">Explora productos y agrega al carrito</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-white/5 bg-white/[0.04] pl-9 pr-3 text-sm text-white/70 placeholder:text-white/30 outline-none transition-all duration-200 focus:border-cyan-500/30 focus:bg-white/[0.06] focus:shadow-[0_0_12px_rgba(6,182,212,0.06)]"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-white/40" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-4 py-20">
              <p className="text-white/50">Error al cargar productos</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04]">
                <Search className="h-8 w-8 text-white/20" />
              </div>
              <p className="text-sm text-white/40">
                {search ? "No se encontraron productos" : "No hay productos disponibles"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {data && data.count > 20 && (
            <div className="flex items-center justify-center gap-2 text-sm text-white/40">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data.previous}
                className="rounded-lg px-3 py-1.5 transition-colors hover:bg-white/[0.04] disabled:opacity-30"
              >
                Anterior
              </button>
              <span>Pág. {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.next}
                className="rounded-lg px-3 py-1.5 transition-colors hover:bg-white/[0.04] disabled:opacity-30"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {cartItems.length > 0 ? (
            <>
              <div className="hidden lg:block">
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <CartItem key={item.product_id} item={item} />
                  ))}
                </div>
              </div>
              <CartSummary />
            </>
          ) : (
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-8 text-center backdrop-blur-md">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04]">
                <ShoppingCart className="h-6 w-6 text-white/20" />
              </div>
              <p className="text-sm text-white/40">Tu carrito está vacío</p>
              <p className="mt-1 text-xs text-white/30">Agrega productos desde la tienda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
