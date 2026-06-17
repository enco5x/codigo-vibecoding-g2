import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import type { ShipmentList } from "@/lib/types/shipment"

const helper = createColumnHelper<ShipmentList>()

const columns = [
  helper.accessor("tracking_number", {
    header: "Tracking",
    cell: (info) => <span className="font-medium text-white/90">{info.getValue()}</span>,
  }),
  helper.accessor("customer_name", {
    header: "Cliente",
    cell: (info) => info.getValue(),
  }),
  helper.accessor("status_display", {
    header: "Estado",
    cell: (info) => {
      const status = info.row.original.status
      const colors: Record<string, string> = {
        pending: "bg-amber-100 text-amber-700",
        assigned: "bg-blue-100 text-blue-700",
        in_transit: "bg-indigo-100 text-indigo-700",
        delivered: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
      }
      return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] ?? ""}`}>{info.getValue()}</span>
    },
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
  helper.accessor("created_at", {
    header: "Creado",
    cell: (info) => {
      const val = info.getValue()
      if (!val) return "-"
      return new Date(val).toLocaleDateString("es-CL")
    },
  }),
]

function TableRenderer({ column, data }: { column: ColumnDef<ShipmentList>; data: ShipmentList[] }) {
  const table = useReactTable({
    data,
    columns: [column],
    getCoreRowModel: getCoreRowModel(),
  })
  if (table.getRowModel().rows.length === 0) return null
  const cell = table.getRowModel().rows[0].getVisibleCells()[0]
  return <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
}

function renderCell(column: ColumnDef<ShipmentList>, row: ShipmentList) {
  return render(<TableRenderer column={column} data={[row]} />)
}

const baseRow: ShipmentList = {
  id: 1,
  tracking_number: "TRK-001",
  customer_name: "Empresa A",
  status: "in_transit",
  status_display: "En tránsito",
  destination_city: "Santiago",
  scheduled_delivery: "2026-06-10T00:00:00Z",
  shipping_cost: "150.00",
  created_at: "2026-06-01T10:00:00Z",
}

describe("shipments columns", () => {
  it("renders tracking_number with font-medium class", () => {
    const { container } = renderCell(columns[0], baseRow)
    const span = container.querySelector("span")
    expect(span).toHaveClass("font-medium")
    expect(span).toHaveTextContent("TRK-001")
  })

  it("renders customer_name", () => {
    const { container } = renderCell(columns[1], baseRow)
    expect(container.textContent).toBe("Empresa A")
  })

  it("renders status_display with colored badge", () => {
    const { container } = renderCell(columns[2], baseRow)
    const span = container.querySelector("span")
    expect(span).toHaveClass("inline-flex")
    expect(span).toHaveTextContent("En tránsito")
  })

  it("renders destination_city", () => {
    const { container } = renderCell(columns[3], baseRow)
    expect(container.textContent).toBe("Santiago")
  })

  it("renders scheduled_delivery formatted or dash", () => {
    const { container } = renderCell(columns[4], baseRow)
    expect(container.textContent).not.toBe("-")

    const { container: c2 } = renderCell(columns[4], { ...baseRow, scheduled_delivery: null })
    expect(c2.textContent).toBe("-")
  })

  it("renders shipping_cost formatted as $X.XX", () => {
    const { container } = renderCell(columns[5], baseRow)
    expect(container.textContent).toBe("$150.00")
  })

  it("renders created_at or dash", () => {
    const { container } = renderCell(columns[6], baseRow)
    expect(container.textContent).not.toBe("-")

    const { container: c2 } = renderCell(columns[6], { ...baseRow, created_at: "" })
    expect(c2.textContent).toBe("-")
  })
})
