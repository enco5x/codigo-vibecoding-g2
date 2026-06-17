"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/lib/store/auth.store"
import { Loader2, User, Shield, Calendar, Mail, CheckCircle, XCircle } from "lucide-react"

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const userLoading = useAuthStore((s) => s.userLoading)
  const fetchUser = useAuthStore((s) => s.fetchUser)

  useEffect(() => {
    if (!user) fetchUser()
  }, [user, fetchUser])

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "AD"

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Mi perfil</h1>
        <p className="mt-1 text-sm text-white/40">Información de tu cuenta</p>
      </div>

      {userLoading && !user ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-white/40" />
        </div>
      ) : !user ? (
        <div className="rounded-xl border border-white/5 bg-white/[0.03] px-6 py-12 text-center">
          <p className="text-sm text-white/40">No se pudo cargar la información del perfil.</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-md">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/20 text-xl font-semibold text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                {initials}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.username}
                </h2>
                <p className="text-sm text-white/50">@{user.username}</p>
                {user.groups.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {user.groups.map((g) => (
                      <span
                        key={g}
                        className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-medium text-cyan-300"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.03] backdrop-blur-md">
            <div className="border-b border-white/[0.04] px-6 py-4">
              <h3 className="text-sm font-medium text-white/60">Detalles de la cuenta</h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              <div className="flex items-center gap-4 px-6 py-4">
                <Mail className="h-4 w-4 text-white/30" />
                <div className="flex-1">
                  <p className="text-xs text-white/40">Correo electrónico</p>
                  <p className="text-sm text-white/80">{user.email || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 px-6 py-4">
                <User className="h-4 w-4 text-white/30" />
                <div className="flex-1">
                  <p className="text-xs text-white/40">Nombre completo</p>
                  <p className="text-sm text-white/80">
                    {user.first_name || user.last_name
                      ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 px-6 py-4">
                <Shield className="h-4 w-4 text-white/30" />
                <div className="flex-1">
                  <p className="text-xs text-white/40">Roles</p>
                  <p className="text-sm text-white/80">
                    {user.groups.length > 0 ? user.groups.join(", ") : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 px-6 py-4">
                <Calendar className="h-4 w-4 text-white/30" />
                <div className="flex-1">
                  <p className="text-xs text-white/40">Miembro desde</p>
                  <p className="text-sm text-white/80">
                    {new Date(user.date_joined).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 px-6 py-4">
                {user.is_active ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
                <div className="flex-1">
                  <p className="text-xs text-white/40">Estado</p>
                  <p className="text-sm text-white/80">
                    {user.is_active ? "Activo" : "Inactivo"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
