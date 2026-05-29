"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth.store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Package } from "lucide-react"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login({ username, password })
      router.push("/")
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } }
        setError(axiosErr.response?.data?.detail || "Error al iniciar sesión")
      } else {
        setError("Error de conexión")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full max-w-sm items-center justify-center p-4">
      <div className="relative w-full rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_0_15px_rgba(6,182,212,0.12)] backdrop-blur-xl">
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b from-white/5 to-transparent" />
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Package className="h-7 w-7 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Logística
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Plataforma de gestión logística
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-white/80">
              Nombre de usuario
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              disabled={loading}
              placeholder="Ingresa tu usuario"
              className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-cyan-400 focus:ring-cyan-400/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-white/80">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Ingresa tu contraseña"
              className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-cyan-400 focus:ring-cyan-400/20"
            />
          </div>
          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:bg-cyan-400 hover:shadow-cyan-400/30 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
