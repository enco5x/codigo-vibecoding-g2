import { test, expect } from "./fixtures";

const TS = Date.now();
const API = "http://localhost:8000/api/v1";
const USERNAME = process.env.E2E_USERNAME ?? "admin";
const PASSWORD = process.env.E2E_PASSWORD ?? "admin123";

async function login(request: any): Promise<string> {
  const res = await request.post(`${API}/auth/login/`, {
    data: { username: USERNAME, password: PASSWORD },
  });
  const { access } = await res.json();
  return access;
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

async function apiPost(request: any, token: string, endpoint: string, data: Record<string, unknown>) {
  const url = endpoint.startsWith("/") ? `${API}${endpoint}` : `${API}/${endpoint}/`;
  const r = await request.post(url, {
    headers: authHeaders(token),
    data,
  });
  return r.json();
}

async function apiGet(request: any, token: string, endpoint: string) {
  const url = endpoint.startsWith("/") ? `${API}${endpoint}` : `${API}/${endpoint}/`;
  const r = await request.get(url, {
    headers: authHeaders(token),
  });
  return r.json();
}

async function apiDelete(request: any, token: string, endpoint: string, id: number) {
  await request.delete(`${API}/${endpoint}/${id}/`, {
    headers: authHeaders(token),
  });
}

async function apiPatch(request: any, token: string, endpoint: string, data: Record<string, unknown>) {
  const r = await request.patch(`${API}${endpoint}`, {
    headers: authHeaders(token),
    data,
  });
  return r.json();
}

async function selectOption(page: any, triggerId: string, optionText: string) {
  const trigger = page.locator(`#${triggerId}-trigger`);
  await trigger.click();
  const listbox = page.locator(`#${triggerId}-listbox`);
  await expect(listbox).toBeVisible();
  await listbox.getByRole("option", { name: optionText }).click();
}

async function createAndFindId(
  request: any,
  token: string,
  listEndpoint: string,
  postData: Record<string, unknown>,
  matchField: string,
  matchValue: unknown,
): Promise<number> {
  await apiPost(request, token, listEndpoint, postData);
  const list = await apiGet(request, token, listEndpoint.startsWith("/") ? listEndpoint : `/${listEndpoint}/`);
  const results = list.results ?? list;
  const found = Array.isArray(results)
    ? results.find((item: any) => item[matchField] === matchValue)
    : null;
  if (!found) throw new Error(`Could not find seeded ${listEndpoint} with ${matchField}=${matchValue}`);
  return found.id;
}

interface SeedDeps {
  customerId: number;
  customerName: string;
  warehouseId: number;
  warehouseName: string;
  productId: number;
  productSku: string;
  productName: string;
}

async function seedDependencies(request: any, token: string): Promise<SeedDeps> {
  const customerName = `Cliente Shipment ${TS}`;
  const customerId = await createAndFindId(request, token, "customers", {
    company_name: customerName,
    contact_name: "Contacto Test",
    email: `customer-ship-${TS}@test.com`,
    phone: "+57 300 1111111",
    city: "Bogotá",
    country: "Colombia",
  }, "company_name", customerName);

  const warehouseName = `Bodega Shipment ${TS}`;
  const warehouseId = await createAndFindId(request, token, "warehouses", {
    name: warehouseName,
    code: `WHS-${TS}`,
    city: "Medellín",
  }, "code", `WHS-${TS}`);

  const productSku = `SKU-SHP-${TS}`;
  const productName = `Producto Shipment ${TS}`;
  const productId = await createAndFindId(request, token, "products", {
    sku: productSku,
    name: productName,
    unit_price: "35.00",
    stock_quantity: 100,
    is_active: true,
  }, "sku", productSku);

  return {
    customerId,
    customerName,
    warehouseId,
    warehouseName,
    productId,
    productSku,
    productName,
  };
}

async function cleanupDeps(request: any, token: string, deps: SeedDeps) {
  await apiDelete(request, token, "products", deps.productId);
  await apiDelete(request, token, "warehouses", deps.warehouseId);
  await apiDelete(request, token, "customers", deps.customerId);
}

async function seedShipment(
  request: any,
  token: string,
  customerId: number,
  opts?: { warehouseId?: number; status?: string },
): Promise<{ id: number; tracking_number: string }> {
  const uniqueAddr = `Calle 100 #15-20-${TS}-${Math.random().toString(36).slice(2, 6)}`;
  await apiPost(request, token, "shipments", {
    customer: customerId,
    warehouse: opts?.warehouseId ?? null,
    destination_address: uniqueAddr,
    destination_city: "Bogotá",
    destination_country: "Colombia",
    origin_address: "Cra 43 #1-50",
    notes: "Envío de prueba",
  });

  const list = await apiGet(request, token, "/shipments/?page=1");
  const results = list.results ?? list;
  const found = Array.isArray(results)
    ? results.find((s: any) => s.destination_address === uniqueAddr)
    : null;

  if (!found) {
    throw new Error(`Failed to find seeded shipment with address=${uniqueAddr}`);
  }

  if (opts?.status && opts.status !== "pending") {
    await apiPatch(request, token, `/shipments/${found.id}/status/`, { status: opts.status });
  }

  return { id: found.id, tracking_number: found.tracking_number };
}

async function seedCustomer(request: any, token: string, name: string): Promise<number> {
  return createAndFindId(request, token, "customers", {
    company_name: name,
    city: "Barranquilla",
  }, "company_name", name);
}

test.describe("Shipments CRUD", () => {
  let token: string;
  let deps: SeedDeps;

  test.beforeAll(async ({ request }) => {
    token = await login(request);
    deps = await seedDependencies(request, token);
  });

  test.afterAll(async ({ request }) => {
    const t = token || await login(request);
    await cleanupDeps(request, t, deps);
  });

  test("Lista carga y renderiza la tabla con datos sembrados", async ({
    page,
    request,
  }) => {
    const { id, tracking_number } = await seedShipment(request, token, deps.customerId, {
      warehouseId: deps.warehouseId,
    });

    try {
      await page.goto("/shipments");
      await page.waitForURL("**/shipments");

      await expect(page.getByRole("heading", { name: "Envíos" })).toBeVisible();
      await expect(page.getByRole("columnheader", { name: "Tracking" })).toBeVisible();
      await expect(page.getByRole("columnheader", { name: "Cliente" })).toBeVisible();

      const table = page.getByRole("table");
      await expect(table.getByRole("link", { name: tracking_number })).toBeVisible();
      await expect(table.getByRole("cell", { name: deps.customerName })).toBeVisible();
      await expect(table.getByRole("cell", { name: "Bogotá" })).toBeVisible();
    } finally {
      await apiDelete(request, token, "shipments", id);
    }
  });

  test("Crear: formulario válido genera tracking_number automático", async ({
    page,
    request,
  }) => {
    let createdId: number | null = null;

    await page.goto("/shipments");
    await page.waitForURL("**/shipments");

    await page.getByRole("button", { name: "Nuevo envío" }).click();

    await expect(
      page.getByRole("dialog").filter({ hasText: "Nuevo envío" }),
    ).toBeVisible();

    await selectOption(page, "customer", deps.customerName);
    await selectOption(page, "warehouse", deps.warehouseName);

    await page.locator("#destination_address").fill(`Calle 72 #10-15-${TS}`);
    await page.locator("#destination_city").fill("Cali");
    await page.locator("#destination_country").fill("Colombia");
    await page.locator("#origin_address").fill("Cra 50 #20-30");
    await page.locator("#weight_kg").fill("12.5");
    await page.locator("#notes").fill("Envío de prueba E2E");

    await page.getByRole("button", { name: "Guardar cambios" }).click();

    await expect(
      page.getByRole("dialog").filter({ hasText: "Nuevo envío" }),
    ).not.toBeVisible({ timeout: 15000 });

    const list = await apiGet(request, token, "/shipments/?page=1");
    const results = list.results ?? list;
    const found = Array.isArray(results)
      ? results.find((s: any) => s.destination_city === "Cali")
      : null;

    expect(found).toBeTruthy();
    expect(found.tracking_number).toBeTruthy();
    createdId = found.id;

    try {
      const table = page.getByRole("table");
      await expect(table.getByRole("link", { name: found.tracking_number })).toBeVisible({
        timeout: 10000,
      });
    } finally {
      if (createdId) await apiDelete(request, token, "shipments", createdId);
    }
  });

  test("Validación: enviar vacío no crea nada", async ({
    page,
    request,
  }) => {
    const countRes = await apiGet(request, token, "/shipments/");
    const countBefore = countRes.count;

    await page.goto("/shipments");
    await page.waitForURL("**/shipments");

    await page.getByRole("button", { name: "Nuevo envío" }).click();
    await expect(
      page.getByRole("dialog").filter({ hasText: "Nuevo envío" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await expect(
      page.getByRole("dialog").filter({ hasText: "Nuevo envío" }),
    ).toBeVisible({ timeout: 5000 });

    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(
      page.getByRole("dialog").filter({ hasText: "Nuevo envío" }),
    ).not.toBeVisible();

    const countRes2 = await apiGet(request, token, "/shipments/");
    expect(countRes2.count).toBe(countBefore);
  });

  test("Detalle muestra información del envío", async ({
    page,
    request,
  }) => {
    const { id, tracking_number } = await seedShipment(request, token, deps.customerId, {
      warehouseId: deps.warehouseId,
    });

    await page.goto(`/shipments/${id}`);

    await expect(page.getByRole("heading", { name: tracking_number })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(deps.customerName)).toBeVisible();
    await expect(page.getByText("Bogotá, Colombia")).toBeVisible();
  });

  test("Agregar ítem al envío desde el detalle", async ({
    page,
    request,
  }) => {
    const { id, tracking_number } = await seedShipment(request, token, deps.customerId);

    await page.goto(`/shipments/${id}`);
    await expect(page.getByRole("heading", { name: tracking_number })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: "Agregar ítem" })).toBeVisible();

    await page.getByRole("button", { name: "Agregar ítem" }).click();

    await expect(
      page.getByRole("dialog").filter({ hasText: "Agregar ítem" }),
    ).toBeVisible();

    const productOption = `${deps.productSku} — ${deps.productName}`;
    await page.locator("#item_product").selectOption({ label: productOption });
    await page.locator("#item_qty").fill("5");
    await page.locator("#item_price").fill("35.00");

    await page.getByRole("button", { name: "Agregar" }).click();

    await expect(
      page.getByRole("dialog").filter({ hasText: "Agregar ítem" }),
    ).not.toBeVisible({ timeout: 10000 });

    await expect(page.getByText(deps.productName)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("$175.00")).toBeVisible();
  });

  test("Transición de status: pending → assigned → in_transit", async ({
    page,
    request,
  }) => {
    const { id, tracking_number } = await seedShipment(request, token, deps.customerId);

    await page.goto(`/shipments/${id}`);
    await expect(page.getByRole("heading", { name: tracking_number })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Pendiente").first()).toBeVisible();

    const statusSelect = page.locator("select").last();
    await expect(statusSelect).toBeVisible();
    await statusSelect.selectOption("assigned");

    await expect(page.getByText("Asignado").first()).toBeVisible({ timeout: 10000 });

    await page.goto(`/shipments/${id}`);
    await expect(page.getByText("Asignado").first()).toBeVisible();

    const statusSelect2 = page.locator("select").last();
    await expect(statusSelect2).toBeVisible();
    await statusSelect2.selectOption("in_transit");

    await expect(page.getByText("En tránsito").first()).toBeVisible({ timeout: 10000 });

    await page.goto("/shipments");
    await page.waitForURL("**/shipments");

    const table = page.getByRole("table");
    const row = table.getByRole("row").filter({ hasText: tracking_number });
    await expect(row).toBeVisible();
    await expect(row.getByText("En tránsito")).toBeVisible({ timeout: 10000 });
  });

  test("Eliminar: desde la UI con confirmación", async ({
    page,
    request,
  }) => {
    const { id, tracking_number } = await seedShipment(request, token, deps.customerId);

    await page.goto("/shipments");
    await page.waitForURL("**/shipments");

    const table = page.getByRole("table");
    await expect(table.getByRole("link", { name: tracking_number })).toBeVisible();

    const row = table.getByRole("row").filter({ hasText: tracking_number });
    const deleteBtn = row.locator("button").last();
    await deleteBtn.click();

    await expect(
      page.getByRole("dialog").filter({ hasText: "Eliminar envío" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Eliminar" }).click();

    await expect(
      page.getByRole("dialog").filter({ hasText: "Eliminar envío" }),
    ).not.toBeVisible({ timeout: 10000 });

    await expect(table.getByRole("link", { name: tracking_number })).not.toBeVisible({
      timeout: 10000,
    });
  });

  test("Búsqueda filtra por tracking, cliente o destino", async ({
    page,
    request,
  }) => {
    const needle = `SearchShip-${TS}`;
    const customerAId = await seedCustomer(request, token, needle);
    const shipmentA = await seedShipment(request, token, customerAId);

    const otherName = `Other Customer ${TS}`;
    const customerBId = await seedCustomer(request, token, otherName);
    const shipmentB = await seedShipment(request, token, customerBId);

    try {
      await page.goto("/shipments");
      await page.waitForURL("**/shipments");

      await page.getByPlaceholder("Buscar por tracking, cliente o destino...").fill(needle);

      const table = page.getByRole("table");
      await expect(table.getByRole("link", { name: shipmentA.tracking_number })).toBeVisible();
      await expect(table.getByRole("link", { name: shipmentB.tracking_number })).not.toBeVisible();
    } finally {
      await apiDelete(request, token, "shipments", shipmentA.id);
      await apiDelete(request, token, "shipments", shipmentB.id);
      await apiDelete(request, token, "customers", customerAId);
      await apiDelete(request, token, "customers", customerBId);
    }
  });
});
