"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table"
import { useUsers } from "@/lib/hooks/use-users"
import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTableToolbar } from "@/components/ui/data-table-toolbar"
import { Plus, Loader2, ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react"
import { useDeleteUser } from "@/lib/hooks/use-users"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const helper = createColumnHelper<User>()

export function UsersTable() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<User | null>(null)
  const { data, isLoading, isError, refetch } = useUsers(page)
  const deleteMutation = useDeleteUser()

  const columns = useMemo(
    () => [
      helper.accessor("username", {
        header: "Usuario",
        cell: (info) => <span className="font-medium text-white/90">{info.getValue()}</span>,
      }),
      helper.accessor("email", {
        header: "Email",
        cell: (info) => info.getValue() || "-",
      }),
      helper.accessor("first_name", {
        header: "Nombre",
        cell: (info) => info.getValue() || "-",
      }),
      helper.accessor("last_name", {
        header: "Apellido",
        cell: (info) => info.getValue() || "-",
      }),
      helper.accessor("is_active", {
        header: "Activo",
        cell: (info) => (
          <span className={info.getValue() ? "text-emerald-400" : "text-white/30"}>
            {info.getValue() ? "Sí" : "No"}
          </span>
        ),
      }),
      helper.accessor("is_superuser", {
        header: "Superadmin",
        cell: (info) => (
          <span className={info.getValue() ? "text-amber-400" : "text-white/30"}>
            {info.getValue() ? "Sí" : "No"}
          </span>
        ),
      }),
      helper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex gap-1 justify-end">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => router.push(`/users/${row.original.id}`)}
              className="text-white/40 hover:text-white/80"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setDeleting(row.original)}
              className="text-white/40 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    [router]
  )

  const filteredData = useMemo(() => {
    if (!data?.results) return []
    if (!search) return data.results
    const q = search.toLowerCase()
    return data.results.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.first_name.toLowerCase().includes(q) ||
        u.last_name.toLowerCase().includes(q)
    )
  }, [data, search])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await deleteMutation.mutateAsync(deleting.id)
      setDeleting(null)
    } catch {
      // handled by query client
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-white/50">Error al cargar usuarios</p>
        <Button variant="outline" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <DataTableToolbar
          title="Usuarios"
          searchPlaceholder="Buscar usuario..."
          searchValue={search}
          onSearchChange={setSearch}
          onExport={() => {}}
          action={
            <Button
              onClick={() => router.push("/users/nuevo")}
              className="bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:bg-cyan-400 hover:shadow-cyan-400/30 active:scale-[0.98]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo usuario
            </Button>
          }
        />

        <div className="rounded-xl border border-white/5 bg-white/[0.03] backdrop-blur-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead
                      key={h.id}
                      onClick={h.column.getToggleSortingHandler()}
                      className={h.column.getCanSort() ? "cursor-pointer select-none" : ""}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="py-12 text-center text-white/40">
                    No hay usuarios
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {data && (
          <div className="flex items-center justify-between text-sm text-white/40">
            <p>
              {data.count} registro{data.count !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={!data.previous}
                onClick={() => setPage((p) => p - 1)}
                className="text-white/40 hover:text-white/80"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-2 text-white/50">Pág. {page}</span>
              <Button
                variant="ghost"
                size="sm"
                disabled={!data.next}
                onClick={() => setPage((p) => p + 1)}
                className="text-white/40 hover:text-white/80"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar usuario</DialogTitle>
            <DialogDescription>
              ¿Eliminar usuario <strong>{deleting?.username}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)} disabled={deleteMutation.isPending}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
