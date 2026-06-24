"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Warehouse,
  Building2,
  Package,
  Truck,
  Car,
  Ship,
  Route,
  LogOut,
  Shield,
  Settings,
  ShoppingCart,
} from "lucide-react"
import { useAuthStore } from "@/lib/store/auth.store"
import { useRouter } from "next/navigation"
import { canAccess, type Module } from "@/lib/permissions"

const modules: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; module: Module }[] = [
  { href: "/customers", label: "Clientes", icon: Users, module: "customers" },
  { href: "/warehouses", label: "Bodegas", icon: Warehouse, module: "warehouses" },
  { href: "/suppliers", label: "Proveedores", icon: Building2, module: "suppliers" },
  { href: "/products", label: "Productos", icon: Package, module: "products" },
  { href: "/drivers", label: "Conductores", icon: Truck, module: "drivers" },
  { href: "/transports", label: "Vehículos", icon: Car, module: "transports" },
  { href: "/shipments", label: "Envíos", icon: Ship, module: "shipments" },
  { href: "/routes", label: "Rutas", icon: Route, module: "routes" },
]

interface Props {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: Props) {
  const pathname = usePathname()
  const logout = useAuthStore((s) => s.logout)
  const username = useAuthStore((s) => s.username)
  const user = useAuthStore((s) => s.user)
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin)
  const router = useRouter()

  const groups = user?.groups ?? []
  const permissions = user?.permissions ?? []
  const isSuperuser = user?.is_superuser ?? false

  const visibleModules = modules.filter((m) => canAccess(m.module, "read", groups, permissions, isSuperuser))

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : "AD"

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-white/5 bg-white/[0.03] backdrop-blur-2xl transition-transform duration-300 md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/5 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            <Package className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-white">Logística</span>
            <span className="text-[10px] text-white/40">Gestión logística</span>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          <Link
            href="/dashboard"
            onClick={onClose}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              pathname === "/dashboard"
                ? "bg-cyan-500/10 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.06)]"
                : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
            )}
          >
            <LayoutDashboard className={cn("h-4 w-4 shrink-0 transition-colors duration-200", pathname === "/dashboard" && "text-cyan-400")} />
            Dashboard
          </Link>

          <Link
            href="/cart"
            onClick={onClose}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              pathname === "/cart"
                ? "bg-cyan-500/10 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.06)]"
                : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
            )}
          >
            <ShoppingCart className={cn("h-4 w-4 shrink-0 transition-colors duration-200", pathname === "/cart" && "text-cyan-400")} />
            Tienda
          </Link>

          {visibleModules.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.06)]"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0 transition-colors duration-200", isActive && "text-cyan-400")} />
                {link.label}
              </Link>
            )
          })}

          {isSuperAdmin && (
            <>
              <div className="mt-4 mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/20">
                Administración
              </div>
              <Link
                href="/users"
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  pathname === "/users" || pathname.startsWith("/users/")
                    ? "bg-cyan-500/10 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.06)]"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                )}
              >
                <Settings className="h-4 w-4 shrink-0" />
                Usuarios
              </Link>
              <Link
                href="/users/groups"
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  pathname === "/users/groups"
                    ? "bg-cyan-500/10 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.06)]"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                )}
              >
                <Shield className="h-4 w-4 shrink-0" />
                Roles
              </Link>
            </>
          )}
        </nav>

        <div className="border-t border-white/5 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-white/70">
              {initials}
            </div>
            <span className="text-xs text-white/50">{username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40 transition-all duration-200 hover:bg-white/[0.04] hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}
