"use client"

import { useAuthStore } from "@/lib/store/auth.store"
import { Button } from "@/components/ui/button"
import { Menu, Search, Bell } from "lucide-react"

interface Props {
  onToggle: () => void
}

export function Navbar({ onToggle }: Props) {
  const username = useAuthStore((s) => s.username)

  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : "AD"

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

        <div className="flex items-center gap-3 border-l border-white/5 pl-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/20 text-[11px] font-semibold text-cyan-400">
            {initials}
          </div>
          <span className="hidden text-sm text-white/60 sm:block">{username}</span>
        </div>
      </div>
    </header>
  )
}
