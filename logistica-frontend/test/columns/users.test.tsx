import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import type { User } from "@/lib/types"
import { StatusDot } from "@/components/ui/status-dot"

const helper = createColumnHelper<User>()

const columns = [
  helper.accessor("username", {
    header: "Usuario",
    cell: (info) => <span className="font-medium text-white/90">{info.getValue()}</span>,
  }),
  helper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
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
      <StatusDot variant={info.getValue() ? "active" : "inactive"} label={info.getValue() ? "Activo" : "Inactivo"} />
    ),
  }),
  helper.accessor("is_superuser", {
    header: "Superusuario",
    cell: (info) => (
      <StatusDot variant={info.getValue() ? "active" : "inactive"} label={info.getValue() ? "Sí" : "No"} />
    ),
  }),
]

function TableRenderer({ column, data }: { column: ColumnDef<User>; data: User[] }) {
  const table = useReactTable({
    data,
    columns: [column],
    getCoreRowModel: getCoreRowModel(),
  })
  if (table.getRowModel().rows.length === 0) return null
  const cell = table.getRowModel().rows[0].getVisibleCells()[0]
  return <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
}

function renderCell(column: ColumnDef<User>, row: User) {
  return render(<TableRenderer column={column} data={[row]} />)
}

const baseRow: User = {
  id: 1,
  username: "admin",
  email: "admin@test.com",
  first_name: "Admin",
  last_name: "User",
  is_active: true,
  is_superuser: true,
  is_staff: true,
  date_joined: "2026-01-01T00:00:00Z",
  groups: ["admin"],
  permissions: ["all"],
}

describe("users columns", () => {
  it("renders username with font-medium class", () => {
    const { container } = renderCell(columns[0], baseRow)
    const span = container.querySelector("span")
    expect(span).toHaveClass("font-medium")
    expect(span).toHaveTextContent("admin")
  })

  it("renders email", () => {
    const { container } = renderCell(columns[1], baseRow)
    expect(container.textContent).toBe("admin@test.com")
  })

  it("renders first_name or fallback dash", () => {
    const { container } = renderCell(columns[2], baseRow)
    expect(container.textContent).toBe("Admin")

    const { container: c2 } = renderCell(columns[2], { ...baseRow, first_name: "" })
    expect(c2.textContent).toBe("-")
  })

  it("renders last_name or fallback dash", () => {
    const { container } = renderCell(columns[3], baseRow)
    expect(container.textContent).toBe("User")

    const { container: c2 } = renderCell(columns[3], { ...baseRow, last_name: "" })
    expect(c2.textContent).toBe("-")
  })

  it("renders is_active with StatusDot", () => {
    const { container } = renderCell(columns[4], baseRow)
    expect(container.textContent).toBe("Activo")

    const { container: c2 } = renderCell(columns[4], { ...baseRow, is_active: false })
    expect(c2.textContent).toBe("Inactivo")
  })

  it("renders is_superuser with StatusDot and Sí/No", () => {
    const { container } = renderCell(columns[5], baseRow)
    expect(container.textContent).toBe("Sí")

    const { container: c2 } = renderCell(columns[5], { ...baseRow, is_superuser: false })
    expect(c2.textContent).toBe("No")
  })
})
