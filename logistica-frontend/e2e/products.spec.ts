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

async function seedSupplier(request: any, token: string): Promise<{ id: number; name: string }> {
  const name = `Proveedor ${TS}`;
  const r = await request.post(`${API}/suppliers/`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { company_name: name, city: "Bogotá" },
  });
  const body = await r.json();
  return { id: body.id, name };
}

async function seedWarehouse(request: any, token: string): Promise<{ id: number; name: string }> {
  const name = `Bodega Prod ${TS}`;
  const r = await request.post(`${API}/warehouses/`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name, code: `WHP-${TS}`, city: "Medellín" },
  });
  const body = await r.json();
  return { id: body.id, name };
}

async function removeById(request: any, token: string, endpoint: string, id: number) {
  await request.delete(`${API}/${endpoint}/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function apiDelete(request: any, token: string, endpoint: string, id: number) {
  await request.delete(`${API}/${endpoint}/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function selectOption(page: any, triggerId: string, optionText: string) {
  const trigger = page.locator(`#${triggerId}-trigger`);
  await trigger.click();
  const listbox = page.locator(`#${triggerId}-listbox`);
  await expect(listbox).toBeVisible();
  await listbox.getByRole("option", { name: optionText }).click();
}

test.describe("Products CRUD", () => {
  let supplierId: number;
  let supplierName: string;
  let warehouseId: number;
  let warehouseName: string;
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await login(request);
    const s = await seedSupplier(request, token);
    supplierId = s.id;
    supplierName = s.name;
    const w = await seedWarehouse(request, token);
    warehouseId = w.id;
    warehouseName = w.name;
  });

  test.afterAll(async ({ request }) => {
    const t = token || await login(request);
    await removeById(request, t, "suppliers", supplierId);
    await removeById(request, t, "warehouses", warehouseId);
  });

  test("Lista carga y renderiza la tabla con datos sembrados", async ({
    page,
    authContext,
  }) => {
    const sku = `SKU-LIST-${TS}`;
    const name = `Producto List ${TS}`;
    const r = await authContext.api.post(`${API}/products/`, {
      data: {
        sku,
        name,
        unit_price: "25.50",
        stock_quantity: 10,
        supplier: supplierId,
        warehouse: warehouseId,
      },
    });
    const created = await r.json();
    const id = created.id;

    try {
      await page.goto("/products");
      await page.waitForURL("**/products");

      await expect(
        page.getByRole("heading", { name: "Productos" }),
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "SKU" }),
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "Nombre" }),
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "Proveedor" }),
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "Bodega" }),
      ).toBeVisible();

      await expect(page.getByRole("cell", { name: sku })).toBeVisible();
      await expect(page.getByRole("cell", { name })).toBeVisible();
    } finally {
      await apiDelete(authContext.api, token, "products", id);
    }
  });

  test("Crear: formulario válido con selects de proveedor y bodega", async ({
    page,
    authContext,
  }) => {
    const sku = `SKU-CR-${TS}`;
    const name = `Producto Create ${TS}`;
    let createdId: number | null = null;

    await page.goto("/products");
    await page.waitForURL("**/products");

    await page.getByRole("button", { name: "Nuevo producto" }).click();

    await expect(
      page.getByRole("dialog").filter({ hasText: "Nuevo producto" }),
    ).toBeVisible();

    await page.locator("#sku").fill(sku);
    await page.locator("#name").fill(name);
    await page.locator("#unit_price").fill("99.99");

    await selectOption(page, "supplier", supplierName);
    await selectOption(page, "warehouse", warehouseName);

    await page.getByRole("button", { name: "Guardar cambios" }).click();

    await expect(
      page.getByRole("dialog").filter({ hasText: "Nuevo producto" }),
    ).not.toBeVisible({ timeout: 10000 });

    await expect(page.getByRole("cell", { name: sku })).toBeVisible({
      timeout: 10000,
    });

    try {
      const r = await authContext.api.get(`${API}/products/?page=1`);
      const body = await r.json();
      const found = body.results?.find((p: { sku: string }) => p.sku === sku);
      if (found) createdId = found.id;
    } finally {
      if (createdId) await apiDelete(authContext.api, token, "products", createdId);
    }
  });

  test("Validación: enviar vacío no crea nada", async ({
    page,
    authContext,
  }) => {
    const countRes = await authContext.api.get(`${API}/products/`);
    const countBefore = (await countRes.json()).count;

    await page.goto("/products");
    await page.waitForURL("**/products");

    await page.getByRole("button", { name: "Nuevo producto" }).click();
    await expect(
      page.getByRole("dialog").filter({ hasText: "Nuevo producto" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await expect(
      page.getByRole("dialog").filter({ hasText: "Nuevo producto" }),
    ).toBeVisible({ timeout: 5000 });

    await page.locator("#sku").fill("TEST");
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await expect(
      page.getByRole("dialog").filter({ hasText: "Nuevo producto" }),
    ).toBeVisible({ timeout: 5000 });

    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(
      page.getByRole("dialog").filter({ hasText: "Nuevo producto" }),
    ).not.toBeVisible();

    const countRes2 = await authContext.api.get(`${API}/products/`);
    const countAfter = (await countRes2.json()).count;
    expect(countAfter).toBe(countBefore);
  });

  test("Editar: cambiar nombre y verificar el cambio", async ({
    page,
    authContext,
  }) => {
    const sku = `SKU-ED-${TS}`;
    const originalName = `Producto Edit Original ${TS}`;
    const updatedName = `Producto Edit Actualizado ${TS}`;
    const r = await authContext.api.post(`${API}/products/`, {
      data: { sku, name: originalName, unit_price: "10.00" },
    });
    const created = await r.json();
    const id = created.id;

    try {
      await page.goto("/products");
      await page.waitForURL("**/products");

      await expect(page.getByRole("cell", { name: sku })).toBeVisible();

      const row = page.getByRole("row").filter({ hasText: sku });
      await row.getByTestId("products-edit").click();

      await expect(
        page.getByRole("dialog").filter({ hasText: "Editar producto" }),
      ).toBeVisible();

      const nameInput = page.locator("#name");
      await expect(nameInput).toHaveValue(originalName, { timeout: 10000 });

      await nameInput.clear();
      await nameInput.fill(updatedName);

      await page.getByRole("button", { name: "Guardar cambios" }).click();

      await expect(
        page.getByRole("dialog").filter({ hasText: "Editar producto" }),
      ).not.toBeVisible({ timeout: 10000 });

      await expect(
        page.getByRole("cell", { name: updatedName }),
      ).toBeVisible({ timeout: 10000 });
    } finally {
      await apiDelete(authContext.api, token, "products", id);
    }
  });

  test("Eliminar: desde la UI con confirmación", async ({
    page,
    authContext,
  }) => {
    const sku = `SKU-DEL-${TS}`;
    const name = `Producto Delete ${TS}`;
    const r = await authContext.api.post(`${API}/products/`, {
      data: { sku, name, unit_price: "5.00" },
    });
    const created = await r.json();
    const id = created.id;

    await page.goto("/products");
    await page.waitForURL("**/products");

    await expect(page.getByRole("cell", { name: sku })).toBeVisible();

    const row = page.getByRole("row").filter({ hasText: sku });
    await row.getByTestId("products-delete").click();

    await expect(
      page.getByRole("dialog").filter({ hasText: "Eliminar producto" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Eliminar" }).click();

    await expect(
      page.getByRole("dialog").filter({ hasText: "Eliminar producto" }),
    ).not.toBeVisible({ timeout: 10000 });

    await expect(page.getByRole("cell", { name: sku })).not.toBeVisible({
      timeout: 10000,
    });
  });

  test("SKU duplicado muestra error del backend", async ({
    page,
    authContext,
  }) => {
    const sku = `SKU-DUP-${TS}`;
    const r = await authContext.api.post(`${API}/products/`, {
      data: { sku, name: `Producto Dup Original ${TS}`, unit_price: "15.00" },
    });
    const created = await r.json();
    const id = created.id;

    try {
      await page.goto("/products");
      await page.waitForURL("**/products");

      await page.getByRole("button", { name: "Nuevo producto" }).click();
      await expect(
        page.getByRole("dialog").filter({ hasText: "Nuevo producto" }),
      ).toBeVisible();

      await page.locator("#sku").fill(sku);
      await page.locator("#name").fill("Duplicado");
      await page.locator("#unit_price").fill("20.00");

      await page.getByRole("button", { name: "Guardar cambios" }).click();

      await expect(page.locator(".text-red-400")).toBeVisible({
        timeout: 10000,
      });
      await expect(
        page.getByRole("dialog").filter({ hasText: "Nuevo producto" }),
      ).toBeVisible();
    } finally {
      await apiDelete(authContext.api, token, "products", id);
    }
  });

  test("Búsqueda filtra por SKU o nombre", async ({ page, authContext }) => {
    const needle = `FindMe-${TS}`;
    const rA = await authContext.api.post(`${API}/products/`, {
      data: { sku: `SKU-A-${TS}`, name: `${needle} Alpha`, unit_price: "1.00" },
    });
    const idA = (await rA.json()).id;
    const rB = await authContext.api.post(`${API}/products/`, {
      data: { sku: `SKU-B-${TS}`, name: "Beta Other", unit_price: "2.00" },
    });
    const idB = (await rB.json()).id;

    try {
      await page.goto("/products");
      await page.waitForURL("**/products");

      await page.getByPlaceholder("Buscar por SKU o nombre...").fill(needle);

      await expect(page.getByRole("cell", { name: /Alpha/ })).toBeVisible();
      await expect(page.getByRole("cell", { name: /Beta/ })).not.toBeVisible();
    } finally {
      await apiDelete(authContext.api, token, "products", idA);
      await apiDelete(authContext.api, token, "products", idB);
    }
  });
});
