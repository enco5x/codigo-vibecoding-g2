import { describe, it, expect } from "vitest"
import { renderWithQuery } from "@/test/utils/renderWithQuery"
import { server } from "@/test/msw/server"
import { customersHandlers } from "@/test/handlers/customers"
import { CustomerForm } from "@/components/customers/customer-form"
import { setTokens, clearTokens } from "@/lib/api/client"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

beforeEach(() => {
  clearTokens()
  setTokens("test-token", "test-refresh")
  server.use(...customersHandlers)
})

describe("CustomerForm", () => {
  it("renders create mode with empty fields", () => {
    renderWithQuery(
      <CustomerForm open={true} onOpenChange={() => {}} customer={null} />,
    )
    expect(screen.getByText("Nuevo cliente")).toBeTruthy()
    expect(screen.getByLabelText("Nombre empresa *")).toBeTruthy()
    expect(screen.getByRole("button", { name: /guardar/i })).toBeTruthy()
  })

  it("renders edit mode with customer data", async () => {
    renderWithQuery(
      <CustomerForm
        open={true}
        onOpenChange={() => {}}
        customer={{ id: 1, company_name: "Empresa A", contact_name: "Juan", email: "juan@test.com", city: "Santiago" }}
      />,
    )
    expect(screen.getByText("Editar cliente")).toBeTruthy()
  })
})
