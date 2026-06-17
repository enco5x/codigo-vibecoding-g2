import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import type { WarehouseList } from "@/lib/types/warehouse"
import { StatusDot } from "@/components/ui/status-dot"

const helper = createColumnHelper<WarehouseList>()

const columns = [
  helper.accessor("name", {
    header: "Nombre",
    cell: (info) => <span className="font-medium text-white/90">{info.getValue()}</span>,
  }),
  helper.accessor("code", {
    header: "Código",
    cell: (info) => info.getValue(),
  }),
  helper.accessor("city", {
    header: "Ciudad",
    cell: (info) => info.getValue() || "-",
  }),
  helper.accessor("is_active", {
    header: "Estado",
    cell: (info) => (
      <StatusDot variant={info.getValue() ? "active" : "inactive"} label={info.getValue() ? "Activo" : "Inactivo"} />
    ),
  }),
]

function TableRenderer({ column, data }: { column: ColumnDef<WarehouseList>; data: WarehouseList[] }) {
  const table = useReactTable({
    data,
    columns: [column],
    getCoreRowModel: getCoreRowModel(),
  })
  if (table.getRowModel().rows.length === 0) return null
  const cell = table.getRowModel().rows[0].getVisibleCells()[0]
  return <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
}

function renderCell(column: ColumnDef<WarehouseList>, row: WarehouseList) {
  return render(<TableRenderer column={column} data={[row]} />)
}

const baseRow: WarehouseList = {
  id: 1,
  name: "Bodega Test",
  code: "BT-001",
  city: "Santiago",
  is_active: true,
}

describe("warehouses columns", () => {
  it("renders name with font-medium class", () => {
    const { container } = renderCell(columns[0], baseRow)
    const span = container.querySelector("span")
    expect(span).toHaveClass("font-medium")
    expect(span).toHaveTextContent("Bodega Test")
  })

  it("renders code value", () => {
    const { container } = renderCell(columns[1], baseRow)
    expect(container.textContent).toBe("BT-001")
  })

  it("renders city or fallback dash", () => {
    const { container } = renderCell(columns[2], baseRow)
    expect(container.textContent).toBe("Santiago")

    const { container: c2 } = renderCell(columns[2], { ...baseRow, city: "" })
    expect(c2.textContent).toBe("-")
  })

  it("renders is_active with StatusDot", () => {
    const { container } = renderCell(columns[3], baseRow)
    expect(container.textContent).toBe("Activo")

    const { container: c2 } = renderCell(columns[3], { ...baseRow, is_active: false })
    expect(c2.textContent).toBe("Inactivo")
  })
})
