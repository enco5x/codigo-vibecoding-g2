import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import type { RouteList } from "@/lib/types/route"
import { StatusDot } from "@/components/ui/status-dot"

const helper = createColumnHelper<RouteList>()

const columns = [
  helper.accessor("name", {
    header: "Nombre",
    cell: (info) => <span className="font-medium text-white/90">{info.getValue()}</span>,
  }),
  helper.accessor("transport_plate", {
    header: "Vehículo",
    cell: (info) => info.getValue() ?? "-",
  }),
  helper.accessor("status", {
    header: "Estado",
    cell: (info) => {
      const status = info.getValue()
      const labels: Record<string, string> = { pending: "Pendiente", in_progress: "En curso", completed: "Completada" }
      const variants: Record<string, string> = { pending: "inactive", in_progress: "active", completed: "active" }
      return <StatusDot variant={variants[status] as "active"|"inactive"} label={labels[status]} />
    },
  }),
  helper.accessor("estimated_start", {
    header: "Inicio estimado",
    cell: (info) => {
      const val = info.getValue()
      if (!val) return "-"
      return new Date(val).toLocaleDateString("es-CL")
    },
  }),
  helper.accessor("estimated_end", {
    header: "Fin estimado",
    cell: (info) => {
      const val = info.getValue()
      if (!val) return "-"
      return new Date(val).toLocaleDateString("es-CL")
    },
  }),
]

function TableRenderer({ column, data }: { column: ColumnDef<RouteList>; data: RouteList[] }) {
  const table = useReactTable({
    data,
    columns: [column],
    getCoreRowModel: getCoreRowModel(),
  })
  if (table.getRowModel().rows.length === 0) return null
  const cell = table.getRowModel().rows[0].getVisibleCells()[0]
  return <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
}

function renderCell(column: ColumnDef<RouteList>, row: RouteList) {
  return render(<TableRenderer column={column} data={[row]} />)
}

const baseRow: RouteList = {
  id: 1,
  name: "Ruta Test",
  transport_id: 1,
  transport_plate: "ABC-123",
  status: "in_progress",
  estimated_start: "2026-06-05T08:00:00Z",
  estimated_end: "2026-06-05T18:00:00Z",
  created_at: "2026-06-04T10:00:00Z",
}

describe("routes columns", () => {
  it("renders name with font-medium class", () => {
    const { container } = renderCell(columns[0], baseRow)
    const span = container.querySelector("span")
    expect(span).toHaveClass("font-medium")
    expect(span).toHaveTextContent("Ruta Test")
  })

  it("renders transport_plate or fallback dash", () => {
    const { container } = renderCell(columns[1], baseRow)
    expect(container.textContent).toBe("ABC-123")

    const { container: c2 } = renderCell(columns[1], { ...baseRow, transport_plate: null })
    expect(c2.textContent).toBe("-")
  })

  it("renders status with StatusDot", () => {
    const { container } = renderCell(columns[2], baseRow)
    expect(container.textContent).toBe("En curso")
  })

  it("renders status pending correctly", () => {
    const { container } = renderCell(columns[2], { ...baseRow, status: "pending" })
    expect(container.textContent).toBe("Pendiente")
  })

  it("renders estimated_start formatted or dash", () => {
    const { container } = renderCell(columns[3], baseRow)
    expect(container.textContent).not.toBe("-")

    const { container: c2 } = renderCell(columns[3], { ...baseRow, estimated_start: null })
    expect(c2.textContent).toBe("-")
  })

  it("renders estimated_end formatted or dash", () => {
    const { container } = renderCell(columns[4], baseRow)
    expect(container.textContent).not.toBe("-")

    const { container: c2 } = renderCell(columns[4], { ...baseRow, estimated_end: null })
    expect(c2.textContent).toBe("-")
  })
})
