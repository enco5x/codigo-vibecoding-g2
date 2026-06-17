import { describe, it, expect, type ReactNode } from "vitest"
import { render } from "@testing-library/react"
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import type { CustomerList } from "@/lib/types/customer"

const helper = createColumnHelper<CustomerList>()

const columns = [
  helper.accessor("company_name", {
    header: "Empresa",
    cell: (info) => <span className="font-medium text-white/90">{info.getValue()}</span>,
  }),
  helper.accessor("contact_name", {
    header: "Contacto",
    cell: (info) => info.getValue() || "-",
  }),
  helper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue() || "-",
  }),
  helper.accessor("city", {
    header: "Ciudad",
    cell: (info) => info.getValue() || "-",
  }),
]

function TableRenderer({ column, data }: { column: ColumnDef<CustomerList>; data: CustomerList[] }) {
  const table = useReactTable({
    data,
    columns: [column],
    getCoreRowModel: getCoreRowModel(),
  })
  if (table.getRowModel().rows.length === 0) return null
  const cell = table.getRowModel().rows[0].getVisibleCells()[0]
  return <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
}

function renderCell(column: ColumnDef<CustomerList>, row: CustomerList) {
  return render(<TableRenderer column={column} data={[row]} />)
}

const baseRow: CustomerList = {
  id: 1,
  company_name: "Mi Empresa",
  contact_name: "Carlos",
  email: "carlos@test.com",
  city: "Lima",
}

describe("customers columns", () => {
  it("renders company_name with font-medium class", () => {
    const { container } = renderCell(columns[0], baseRow)
    const span = container.querySelector("span")
    expect(span).toHaveClass("font-medium")
    expect(span).toHaveTextContent("Mi Empresa")
  })

  it("renders contact_name or fallback dash", () => {
    const { container } = renderCell(columns[1], baseRow)
    expect(container.textContent).toBe("Carlos")

    const { container: c2 } = renderCell(columns[1], { ...baseRow, contact_name: "" })
    expect(c2.textContent).toBe("-")
  })

  it("renders email or fallback dash", () => {
    const { container } = renderCell(columns[2], baseRow)
    expect(container.textContent).toBe("carlos@test.com")

    const { container: c2 } = renderCell(columns[2], { ...baseRow, email: "" })
    expect(c2.textContent).toBe("-")
  })

  it("renders city or fallback dash", () => {
    const { container } = renderCell(columns[3], baseRow)
    expect(container.textContent).toBe("Lima")
  })
})
