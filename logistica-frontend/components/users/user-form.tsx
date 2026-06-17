"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser, useCreateUser, useUpdateUser, useGroups } from "@/lib/hooks/use-users"
import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Props {
  userId?: number
}

export function UserForm({ userId }: Props) {
  const router = useRouter()
  const isEditing = !!userId
  const { data: user, isLoading: loadingUser } = useUser(userId ?? 0)
  const { data: groups } = useGroups()
  const create = useCreateUser()
  const update = useUpdateUser(userId ?? 0)

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) return
    setUsername(user.username)
    setEmail(user.email)
    setFirstName(user.first_name)
    setLastName(user.last_name)
    setIsActive(user.is_active)
    setSelectedGroups(user.groups ?? [])
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      if (isEditing) {
        await update.mutateAsync({
          username,
          email: email || undefined,
          password: password || undefined,
          first_name: firstName || undefined,
          last_name: lastName || undefined,
          is_active: isActive,
          groups: selectedGroups.map((name) => {
            const g = groups?.find((gr) => gr.name === name)
            return g!.id
          }),
        })
      } else {
        if (!password) {
          setError("La contraseña es requerida")
          return
        }
        await create.mutateAsync({
          username,
          email: email || undefined,
          password,
          first_name: firstName || undefined,
          last_name: lastName || undefined,
          is_active: isActive,
          groups: selectedGroups.map((name) => {
            const g = groups?.find((gr) => gr.name === name)
            return g!.id
          }),
        })
      }
      router.push("/users")
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { detail?: string } } }).response?.data?.detail
          : undefined
      setError(msg ?? "Error al guardar el usuario")
    }
  }

  const isPending = create.isPending || update.isPending

  if (isEditing && loadingUser) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/users"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/70"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {isEditing ? "Editar usuario" : "Nuevo usuario"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username">Usuario *</Label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isPending} placeholder="Nombre de usuario" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isPending} placeholder="correo@ejemplo.com" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{isEditing ? "Contraseña (dejar vacío para mantener)" : "Contraseña *"}</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!isEditing} disabled={isPending} placeholder="••••••••" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">Nombre</Label>
            <Input id="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={isPending} placeholder="Nombre" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Apellido</Label>
            <Input id="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isPending} placeholder="Apellido" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch checked={isActive} onCheckedChange={(c) => setIsActive(c)} disabled={isPending} />
          <Label className="text-sm text-white/70">Usuario activo</Label>
        </div>

        <div className="space-y-2">
          <Label>Grupos</Label>
          <div className="flex flex-wrap gap-2">
            {groups?.map((g) => {
              const isSelected = selectedGroups.includes(g.name)
              return (
                <button
                  key={g.id}
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    setSelectedGroups(
                      isSelected
                        ? selectedGroups.filter((x) => x !== g.name)
                        : [...selectedGroups, g.name]
                    )
                  }
                  className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    isSelected
                      ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                      : "border-white/10 bg-white/[0.04] text-white/50 hover:border-white/20 hover:text-white/70"
                  }`}
                >
                  {g.name}
                </button>
              )
            })}
            {(!groups || groups.length === 0) && (
              <span className="text-xs text-white/30">No hay grupos disponibles</span>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={() => router.push("/users")} disabled={isPending} className="text-white/50 hover:text-white/80">
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending} className="bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 hover:shadow-cyan-400/30 active:scale-[0.98]">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Guardar cambios" : "Crear usuario"}
          </Button>
        </div>
      </form>
    </div>
  )
}
