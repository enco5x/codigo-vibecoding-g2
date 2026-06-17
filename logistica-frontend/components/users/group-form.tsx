"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGroup, useCreateGroup, useUpdateGroup, usePermissions } from "@/lib/hooks/use-users"
import type { Permission } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Props {
  groupId?: number
}

export function GroupForm({ groupId }: Props) {
  const router = useRouter()
  const isEditing = !!groupId
  const { data: group, isLoading: loadingGroup } = useGroup(groupId ?? 0)
  const { data: allPermissions, isLoading: loadingPerms } = usePermissions()
  const create = useCreateGroup()
  const update = useUpdateGroup(groupId ?? 0)

  const [name, setName] = useState("")
  const [selectedPerms, setSelectedPerms] = useState<number[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    if (!group) return
    setName(group.name)
    setSelectedPerms(group.permissions)
  }, [group])

  const groupedPermissions = allPermissions
    ? allPermissions.reduce<Record<string, Permission[]>>((acc, p) => {
        const key = p.content_type
        if (!acc[key]) acc[key] = []
        acc[key].push(p)
        return acc
      }, {})
    : {}

  const togglePermission = (permId: number) => {
    setSelectedPerms((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      if (isEditing) {
        await update.mutateAsync({ name, permissions: selectedPerms })
      } else {
        await create.mutateAsync({ name, permissions: selectedPerms })
      }
      router.push("/users/groups")
    } catch {
      setError("Error al guardar el rol")
    }
  }

  const isPending = create.isPending || update.isPending

  if ((isEditing && loadingGroup) || loadingPerms) {
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
          href="/users/groups"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/70"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {isEditing ? "Editar rol" : "Nuevo rol"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isPending} placeholder="Nombre del rol" />
        </div>

        <div className="space-y-3">
          <Label>Permisos</Label>
          {Object.entries(groupedPermissions).length === 0 && (
            <p className="text-sm text-white/40">No hay permisos disponibles</p>
          )}
          {Object.entries(groupedPermissions).map(([contentType, perms]) => (
            <div key={contentType} className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-white/30">{contentType}</p>
              <div className="space-y-1 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                {perms.map((perm) => (
                  <label
                    key={perm.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
                  >
                    <Checkbox
                      checked={selectedPerms.includes(perm.id)}
                      onCheckedChange={() => togglePermission(perm.id)}
                      disabled={isPending}
                    />
                    <span className="text-sm text-white/70">{perm.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={() => router.push("/users/groups")} disabled={isPending} className="text-white/50 hover:text-white/80">
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending} className="bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 hover:shadow-cyan-400/30 active:scale-[0.98]">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Guardar cambios" : "Crear rol"}
          </Button>
        </div>
      </form>
    </div>
  )
}
