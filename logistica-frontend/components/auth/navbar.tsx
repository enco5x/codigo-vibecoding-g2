"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/lib/store/auth.store"
import { Button } from "@/components/ui/button"
import { Menu, Search, Bell, User, LogOut, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/lib/store/cart.store"
import { CartSheet } from "@/components/cart/cart-sheet"

interface Props {
  onToggle: () => void
}

export function Navbar({ onToggle }: Props) {
  const username = useAuthStore((s) => s.username)
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const itemCount = useCartStore((s) => s.getItemCount())

  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : "AD"

  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [dropdownOpen])

  const handleLogout = async () => {
    setDropdownOpen(false)
    await logout()
    router.push("/login")
  }

  return (
    <header className="border-b border-white/5 bg-white/[0.02] backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-6">
        <Button variant="ghost" size="icon" className="text-white/50 hover:text-white md:hidden" onClick={onToggle}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative hidden max-w-xs sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Buscar..."
            className="h-9 w-full rounded-lg border border-white/5 bg-white/[0.04] pl-9 pr-3 text-sm text-white/70 placeholder:text-white/30 outline-none transition-all duration-200 focus:border-cyan-500/30 focus:bg-white/[0.06] focus:shadow-[0_0_12px_rgba(6,182,212,0.06)]"
          />
        </div>

        <div className="flex-1" />

        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/60">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </button>

        <button
          onClick={() => setCartOpen(true)}
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/60"
        >
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-500 px-1 text-[10px] font-semibold text-white">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </button>

        <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className={cn(
              "flex items-center gap-3 rounded-lg border border-transparent px-2 py-1.5 transition-all duration-200",
              dropdownOpen
                ? "border-cyan-500/30 bg-cyan-500/10"
                : "hover:bg-white/[0.04]"
            )}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/20 text-[11px] font-semibold text-cyan-400">
              {initials}
            </div>
            <span className="hidden text-sm text-white/60 sm:block">{username}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-white/10 bg-[#12122a] p-1 shadow-lg shadow-black/40">
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-cyan-500/15 hover:text-cyan-300"
              >
                <User className="h-4 w-4" />
                Ver perfil
              </Link>
              <hr className="my-1 border-white/5" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-red-500/15 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
