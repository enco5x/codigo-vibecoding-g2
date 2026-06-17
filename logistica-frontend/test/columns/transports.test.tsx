import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import type { TransportList } from "@/lib/types/transport"
import { StatusDot } from "@/components/ui/status-dot"

const helper = createColumnHelper<TransportList>()

const columns = [
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
]

function TableRenderer({ column, data }: { column: ColumnDef<TransportList>; data: TransportList[] }) {
  const table = useReactTable({
    data,
    columns: [column],
    getCoreRowModel: getCoreRowModel(),
  })
  if (table.getRowModel().rows.length === 0) return null
  const cell = table.getRowModel().rows[0].getVisibleCells()[0]
  return <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
}

function renderCell(column: ColumnDef<TransportList>, row: TransportList) {
  return render(<TableRenderer column={column} data={[row]} />)
}

const baseRow: TransportList = {
  id: 1,
  plate_number: "ABC-123",
  vehicle_type: "Camión",
  vehicle_model: "Volvo FH16",
  driver_name: "Juan Pérez",
  is_available: true,
}

describe("transports columns", () => {
  it("renders plate_number with font-medium class", () => {
    const { container } = renderCell(columns[0], baseRow)
    const span = container.querySelector("span")
    expect(span).toHaveClass("font-medium")
    expect(span).toHaveTextContent("ABC-123")
  })

  it("renders vehicle_type or fallback dash", () => {
    const { container } = renderCell(columns[1], baseRow)
    expect(container.textContent).toBe("Camión")

    const { container: c2 } = renderCell(columns[1], { ...baseRow, vehicle_type: null })
    expect(c2.textContent).toBe("-")
  })

  it("renders vehicle_model or fallback dash", () => {
    const { container } = renderCell(columns[2], baseRow)
    expect(container.textContent).toBe("Volvo FH16")

    const { container: c2 } = renderCell(columns[2], { ...baseRow, vehicle_model: null })
    expect(c2.textContent).toBe("-")
  })

  it("renders driver_name or fallback dash", () => {
    const { container } = renderCell(columns[3], baseRow)
    expect(container.textContent).toBe("Juan Pérez")

    const { container: c2 } = renderCell(columns[3], { ...baseRow, driver_name: null })
    expect(c2.textContent).toBe("-")
  })

  it("renders is_available with StatusDot", () => {
    const { container } = renderCell(columns[4], baseRow)
    expect(container.textContent).toBe("Disponible")

    const { container: c2 } = renderCell(columns[4], { ...baseRow, is_available: false })
    expect(c2.textContent).toBe("No disponible")
  })
})
