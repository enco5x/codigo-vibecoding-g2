"use client"

import { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table"
import { useTransports } from "@/lib/hooks/use-transports"
import type { TransportList } from "@/lib/types/transport"
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
import { StatusDot } from "@/components/ui/status-dot"
import { Plus, Loader2, ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react"
import { useAuthStore } from "@/lib/store/auth.store"
import { canAccess } from "@/lib/permissions"

const helper = createColumnHelper<TransportList>()

interface Props {
  onEdit: (transport: TransportList) => void
  onDelete: (transport: TransportList) => void
  onCreate: () => void
}

export function TransportsList({ onEdit, onDelete, onCreate }: Props) {
  const [page, setPage] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState("")
  const [availFilter, setAvailFilter] = useState<"all" | "available" | "unavailable">("all")
  const { data, isLoading, isError, refetch } = useTransports(page)
  const user = useAuthStore((s) => s.user)
  const groups = user?.groups ?? []
  const permissions = user?.permissions ?? []
  const isSuperuser = user?.is_superuser ?? false
  const canWrite = canAccess("transports", "write", groups, permissions, isSuperuser)

  const columns = useMemo(
    () => [
      helper.accessor("plate_number", {
        header: "Placa",
        cell: (info) => <span className="font-medium text-white/90">{info.getValue()}</span>,
      }),
      helper.accessor("vehicle_type", {
        header: "Tipo",
        cell: (info) => info.getValue() ?? "-",
      }),
      helper.accessor("vehicle_model", {
        header: "Modelo",
        cell: (info) => info.getValue() ?? "-",
      }),
      helper.accessor("driver_name", {
        header: "Conductor",
        cell: (info) => info.getValue() ?? "-",
      }),
      helper.accessor("is_available", {
        header: "Disponible",
        cell: (info) => (
          <StatusDot variant={info.getValue() ? "active" : "inactive"} label={info.getValue() ? "Disponible" : "No disponible"} />
        ),
      }),
      helper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex gap-1 justify-end">
            {canWrite && (
              <Button variant="ghost" size="icon-xs" onClick={() => onEdit(row.original)} className="text-white/40 hover:text-white/80">
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canWrite && (
              <Button variant="ghost" size="icon-xs" onClick={() => onDelete(row.original)} className="text-white/40 hover:text-red-400">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      }),
    ],
    [onEdit, onDelete, canWrite]
  )

  const filteredData = useMemo(() => {
    if (!data?.results) return []
    let items = data.results
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(
        (t) =>
          t.plate_number.toLowerCase().includes(q) ||
          (t.vehicle_type ?? "").toLowerCase().includes(q) ||
          (t.driver_name ?? "").toLowerCase().includes(q)
      )
    }
    if (availFilter === "available") items = items.filter((t) => t.is_available)
    if (availFilter === "unavailable") items = items.filter((t) => !t.is_available)
    return items
  }, [data, search, availFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

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
        <p className="text-white/50">Error al cargar vehículos</p>
        <Button variant="outline" onClick={() => refetch()}>Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar
        title="Vehículos"
        searchPlaceholder="Buscar por placa, tipo o conductor..."
        searchValue={search}
        onSearchChange={setSearch}
        onExport={() => {}}
        action={
          canWrite && (
            <Button onClick={onCreate} className="bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:bg-cyan-400 hover:shadow-cyan-400/30 active:scale-[0.98]">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo vehículo
            </Button>
          )
        }
      >
        <select
          value={availFilter}
          onChange={(e) => setAvailFilter(e.target.value as typeof availFilter)}
          className="h-9 rounded-lg border border-white/5 bg-white/[0.04] px-3 text-sm text-white/60 outline-none transition-all duration-200 focus:border-cyan-500/30 focus:bg-white/[0.06]"
        >
          <option value="all">Todos</option>
          <option value="available">Disponibles</option>
          <option value="unavailable">No disponibles</option>
        </select>
      </DataTableToolbar>

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
                  No hay vehículos
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
            <Button variant="ghost" size="sm" disabled={!data.previous} onClick={() => setPage((p) => p - 1)} className="text-white/40 hover:text-white/80">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 text-white/50">Pág. {page}</span>
            <Button variant="ghost" size="sm" disabled={!data.next} onClick={() => setPage((p) => p + 1)} className="text-white/40 hover:text-white/80">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
