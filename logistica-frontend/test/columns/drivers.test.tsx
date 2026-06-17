import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import type { DriverList } from "@/lib/types/driver"
import { StatusDot } from "@/components/ui/status-dot"

const helper = createColumnHelper<DriverList>()

const columns = [
  helper.accessor("license_number", {
    header: "Licencia",
    cell: (info) => <span className="font-medium text-white/90">{info.getValue()}</span>,
  }),
  helper.accessor("phone", {
    header: "Teléfono",
    cell: (info) => info.getValue() ?? "-",
  }),
  helper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue() ?? "-",
  }),
  helper.accessor("is_available", {
    header: "Disponible",
    cell: (info) => (
      <StatusDot variant={info.getValue() ? "active" : "inactive"} label={info.getValue() ? "Disponible" : "No disponible"} />
    ),
  }),
]

function TableRenderer({ column, data }: { column: ColumnDef<DriverList>; data: DriverList[] }) {
  const table = useReactTable({
    data,
    columns: [column],
    getCoreRowModel: getCoreRowModel(),
  })
  if (table.getRowModel().rows.length === 0) return null
  const cell = table.getRowModel().rows[0].getVisibleCells()[0]
  return <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
}

function renderCell(column: ColumnDef<DriverList>, row: DriverList) {
  return render(<TableRenderer column={column} data={[row]} />)
}

const baseRow: DriverList = {
  id: 1,
  license_number: "LIC-12345",
  phone: "+56 9 1111 1111",
  email: "driver@test.com",
  is_available: true,
}

describe("drivers columns", () => {
  it("renders license_number with font-medium class", () => {
    const { container } = renderCell(columns[0], baseRow)
    const span = container.querySelector("span")
    expect(span).toHaveClass("font-medium")
    expect(span).toHaveTextContent("LIC-12345")
  })

  it("renders phone or fallback dash", () => {
    const { container } = renderCell(columns[1], baseRow)
    expect(container.textContent).toBe("+56 9 1111 1111")

    const { container: c2 } = renderCell(columns[1], { ...baseRow, phone: null })
    expect(c2.textContent).toBe("-")
  })

  it("renders email or fallback dash", () => {
    const { container } = renderCell(columns[2], baseRow)
    expect(container.textContent).toBe("driver@test.com")

    const { container: c2 } = renderCell(columns[2], { ...baseRow, email: null })
    expect(c2.textContent).toBe("-")
  })

  it("renders is_available with StatusDot", () => {
    const { container } = renderCell(columns[3], baseRow)
    expect(container.textContent).toBe("Disponible")

    const { container: c2 } = renderCell(columns[3], { ...baseRow, is_available: false })
    expect(c2.textContent).toBe("No disponible")
  })
})
