export type Module =
  | "customers"
  | "warehouses"
  | "suppliers"
  | "products"
  | "drivers"
  | "transports"
  | "shipments"
  | "routes"

export type Action = "read" | "write"

const MODULE_PERMISSION_CODENAME: Record<Module, string> = {
  customers: "view_customer",
  warehouses: "view_warehouse",
  suppliers: "view_supplier",
  products: "view_product",
  drivers: "view_driver",
  transports: "view_transport",
  shipments: "view_shipment",
  routes: "view_route",
}

const WRITE_ACCESS_GROUPS: Record<Module, string[]> = {
  customers: ["admin", "manager"],
  warehouses: ["admin", "manager"],
  suppliers: ["admin", "manager"],
  products: ["admin", "manager"],
  drivers: ["admin", "manager"],
  transports: ["admin", "manager"],
  shipments: ["admin", "manager"],
  routes: ["admin", "manager"],
}

export function canAccess(
  module: Module,
  action: Action,
  groups: string[],
  permissions: string[],
  isSuperuser: boolean
): boolean {
  if (isSuperuser) return true

  if (action === "read") {
    const codename = MODULE_PERMISSION_CODENAME[module]
    if (permissions.includes(codename)) return true
    return groups.some((g) => ["admin", "manager"].includes(g))
  }

  const allowedGroups = WRITE_ACCESS_GROUPS[module]
  return groups.some((g) => allowedGroups.includes(g))
}
