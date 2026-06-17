import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import type { ProductList } from "@/lib/types/product"
import { StatusDot } from "@/components/ui/status-dot"

const helper = createColumnHelper<ProductList>()

const columns = [
  helper.accessor("sku", {
    header: "SKU",
    cell: (info) => <span className="font-medium text-white/90">{info.getValue()}</span>,
  }),
  helper.accessor("name", {
    header: "Nombre",
    cell: (info) => info.getValue(),
  }),
  helper.accessor("category", {
    header: "Categoría",
    cell: (info) => info.getValue() ?? "-",
  }),
  helper.accessor("unit_price", {
    header: "Precio",
    cell: (info) => `$${info.getValue()}`,
  }),
  helper.accessor("stock_quantity", {
    header: "Stock",
    cell: (info) => info.getValue(),
  }),
  helper.accessor("supplier_name", {
    header: "Proveedor",
    cell: (info) => info.getValue() ?? "-",
  }),
  helper.accessor("warehouse_name", {
    header: "Bodega",
    cell: (info) => info.getValue() ?? "-",
  }),
  helper.accessor("is_active", {
    header: "Estado",
    cell: (info) => (
      <StatusDot variant={info.getValue() ? "active" : "inactive"} label={info.getValue() ? "Activo" : "Inactivo"} />
    ),
  }),
]

function TableRenderer({ column, data }: { column: ColumnDef<ProductList>; data: ProductList[] }) {
  const table = useReactTable({
    data,
    columns: [column],
    getCoreRowModel: getCoreRowModel(),
  })
  if (table.getRowModel().rows.length === 0) return null
  const cell = table.getRowModel().rows[0].getVisibleCells()[0]
  return <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
}

function renderCell(column: ColumnDef<ProductList>, row: ProductList) {
  return render(<TableRenderer column={column} data={[row]} />)
}

const baseRow: ProductList = {
  id: 1,
  sku: "PROD-001",
  name: "Producto Test",
  category: "Electrónica",
  unit_price: "25.50",
  stock_quantity: 100,
  is_active: true,
  supplier_name: "Proveedor A",
  warehouse_name: "Bodega Central",
}

describe("products columns", () => {
  it("renders sku with font-medium class", () => {
    const { container } = renderCell(columns[0], baseRow)
    const span = container.querySelector("span")
    expect(span).toHaveClass("font-medium")
    expect(span).toHaveTextContent("PROD-001")
  })

  it("renders name value", () => {
    const { container } = renderCell(columns[1], baseRow)
    expect(container.textContent).toBe("Producto Test")
  })

  it("renders category or fallback dash", () => {
    const { container } = renderCell(columns[2], baseRow)
    expect(container.textContent).toBe("Electrónica")

    const { container: c2 } = renderCell(columns[2], { ...baseRow, category: null })
    expect(c2.textContent).toBe("-")
  })

  it("renders unit_price formatted as $X.XX", () => {
    const { container } = renderCell(columns[3], baseRow)
    expect(container.textContent).toBe("$25.50")
  })

  it("renders stock_quantity", () => {
    const { container } = renderCell(columns[4], baseRow)
    expect(container.textContent).toBe("100")
  })

  it("renders supplier_name or fallback dash", () => {
    const { container } = renderCell(columns[5], baseRow)
    expect(container.textContent).toBe("Proveedor A")

    const { container: c2 } = renderCell(columns[5], { ...baseRow, supplier_name: null })
    expect(c2.textContent).toBe("-")
  })

  it("renders warehouse_name or fallback dash", () => {
    const { container } = renderCell(columns[6], baseRow)
    expect(container.textContent).toBe("Bodega Central")

    const { container: c2 } = renderCell(columns[6], { ...baseRow, warehouse_name: null })
    expect(c2.textContent).toBe("-")
  })

  it("renders is_active with StatusDot", () => {
    const { container } = renderCell(columns[7], baseRow)
    expect(container.textContent).toBe("Activo")

    const { container: c2 } = renderCell(columns[7], { ...baseRow, is_active: false })
    expect(c2.textContent).toBe("Inactivo")
  })
})
