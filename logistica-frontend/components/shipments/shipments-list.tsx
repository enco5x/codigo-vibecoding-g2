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
import { useShipments } from "@/lib/hooks/use-shipments"
import type { ShipmentList } from "@/lib/types/shipment"
import { StatusBadge } from "@/components/shipments/status"
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
import {
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/lib/store/auth.store"
import { canAccess } from "@/lib/permissions"

const helper = createColumnHelper<ShipmentList>()

interface Props {
  onDelete: (shipment: ShipmentList) => void
  onCreate: () => void
}

export function ShipmentsList({ onDelete, onCreate }: Props) {
  const [page, setPage] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { data, isLoading, isError, refetch } = useShipments(page)
  const user = useAuthStore((s) => s.user)
  const groups = user?.groups ?? []
  const permissions = user?.permissions ?? []
  const isSuperuser = user?.is_superuser ?? false
  const canWrite = canAccess("shipments", "write", groups, permissions, isSuperuser)

  const columns = useMemo(
    () => [
      helper.accessor("tracking_number", {
        header: "Tracking",
        cell: (info) => (
          <Link href={`/shipments/${info.row.original.id}`} className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline">
            {info.getValue()}
          </Link>
        ),
      }),
      helper.accessor("customer_name", {
        header: "Cliente",
        cell: (info) => info.getValue(),
      }),
      helper.accessor("status", {
        header: "Estado",
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      helper.accessor("destination_city", {
        header: "Destino",
        cell: (info) => info.getValue(),
      }),
      helper.accessor("scheduled_delivery", {
        header: "Entrega",
        cell: (info) => {
          const val = info.getValue()
          if (!val) return "-"
          return new Date(val).toLocaleDateString("es-CL")
        },
      }),
      helper.accessor("shipping_cost", {
        header: "Costo",
        cell: (info) => `$${info.getValue()}`,
      }),
      helper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex gap-1 justify-end">
            <Link href={`/shipments/${row.original.id}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/80">
              <Eye className="h-4 w-4" />
            </Link>
            {canWrite && (
              <Button variant="ghost" size="icon-xs" onClick={() => onDelete(row.original)} className="text-white/40 hover:text-red-400">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      }),
    ],
    [onDelete, canWrite]
  )

  const filteredData = useMemo(() => {
    if (!data?.results) return []
    let items = data.results
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(
        (s) =>
          s.tracking_number.toLowerCase().includes(q) ||
          s.customer_name.toLowerCase().includes(q) ||
          s.destination_city.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== "all") items = items.filter((s) => s.status === statusFilter)
    return items
  }, [data, search, statusFilter])

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
        <p className="text-white/50">Error al cargar envíos</p>
        <Button variant="outline" onClick={() => refetch()}>Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar
        title="Envíos"
        searchPlaceholder="Buscar por tracking, cliente o destino..."
        searchValue={search}
        onSearchChange={setSearch}
        onExport={() => {}}
        action={
          canWrite && (
            <Button onClick={onCreate} className="bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:bg-cyan-400 hover:shadow-cyan-400/30 active:scale-[0.98]">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo envío
            </Button>
          )
        }
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-lg border border-white/5 bg-white/[0.04] px-3 text-sm text-white/60 outline-none transition-all duration-200 focus:border-cyan-500/30 focus:bg-white/[0.06]"
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="assigned">Asignado</option>
          <option value="in_transit">En tránsito</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
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
                  No hay envíos
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
