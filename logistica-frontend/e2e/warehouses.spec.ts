import { test, expect } from "./fixtures";

const TS = Date.now();
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

async function seedWarehouse(
  api: any,
  payload: Record<string, unknown>,
): Promise<number> {
  const r = await api.post(`${API}/warehouses/`, { data: payload });
  const body = await r.json();
  return body.id;
}

async function removeWarehouse(api: any, id: number): Promise<void> {
  await api.delete(`${API}/warehouses/${id}/`);
}

async function getWarehouseId(
  api: any,
  search: string,
): Promise<number | null> {
  const r = await api.get(`${API}/warehouses/?search=${encodeURIComponent(search)}`);
  const body = await r.json();
  return body.results?.[0]?.id ?? null;
}

test.describe("Warehouses CRUD", () => {
  test("Lista carga y renderiza la tabla con datos sembrados", async ({
    page,
    authContext,
  }) => {
    const name = `WH-List-${TS}`;
    const id = await seedWarehouse(authContext.api, {
      name,
      code: `WL-${TS}`,
      city: "Medellín",
    });

    try {
      await page.goto("/warehouses");
      await page.waitForURL("**/warehouses");

      await expect(
        page.getByRole("heading", { name: "Bodegas" }),
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "Nombre" }),
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "Código" }),
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "Ciudad" }),
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "Estado" }),
      ).toBeVisible();

      await expect(page.getByRole("cell", { name })).toBeVisible();
    } finally {
      await removeWarehouse(authContext.api, id);
    }
  });

  test("Crear: formulario válido → registro aparece en la lista", async ({
    page,
    authContext,
  }) => {
    const unique = `CR-${TS}`;
    const name = `Bodega Create ${TS}`;
    let createdId: number | null = null;

    await page.goto("/warehouses");
    await page.waitForURL("**/warehouses");

    await page.getByRole("button", { name: "Nueva bodega" }).click();

    await expect(
      page.getByRole("dialog").filter({ hasText: "Nueva bodega" }),
    ).toBeVisible();

    await page.getByPlaceholder("Nombre bodega").fill(name);
    await page.getByPlaceholder("Código bodega").fill(unique);
    await page.getByPlaceholder("Ciudad").fill("Bogotá");

    await page.getByRole("button", { name: "Guardar cambios" }).click();

    await expect(
      page.getByRole("dialog").filter({ hasText: "Nueva bodega" }),
    ).not.toBeVisible({ timeout: 10000 });

    await expect(page.getByRole("cell", { name })).toBeVisible({
      timeout: 10000,
    });

    try {
      createdId = await getWarehouseId(authContext.api, name);
    } finally {
      if (createdId) await removeWarehouse(authContext.api, createdId);
    }
  });

  test("Validación: enviar vacío o con datos inválidos no crea nada", async ({
    page,
    authContext,
  }) => {
    const countBefore = (
      await (await authContext.api.get(`${API}/warehouses/`)).json()
    ).count;

    await page.goto("/warehouses");
    await page.waitForURL("**/warehouses");

    await page.getByRole("button", { name: "Nueva bodega" }).click();
    await expect(
      page.getByRole("dialog").filter({ hasText: "Nueva bodega" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await expect(
      page.getByRole("dialog").filter({ hasText: "Nueva bodega" }),
    ).toBeVisible({ timeout: 5000 });

    await page.getByPlaceholder("Nombre bodega").fill("Solo nombre");
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await expect(
      page.getByRole("dialog").filter({ hasText: "Nueva bodega" }),
    ).toBeVisible({ timeout: 5000 });

    await page.getByPlaceholder("Nombre bodega").fill("Test");
    await page.getByPlaceholder("Código bodega").fill(`DUP-${TS}`);
    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(
      page.getByRole("dialog").filter({ hasText: "Nueva bodega" }),
    ).not.toBeVisible();

    const countAfter = (
      await (await authContext.api.get(`${API}/warehouses/`)).json()
    ).count;
    expect(countAfter).toBe(countBefore);
  });

  test("Editar: cambiar un campo y verificar el cambio", async ({
    page,
    authContext,
  }) => {
    const unique = `ED-${TS}`;
    const originalName = `Bodega Edit Original ${TS}`;
    const updatedName = `Bodega Edit Actualizada ${TS}`;
    const id = await seedWarehouse(authContext.api, {
      name: originalName,
      code: unique,
      city: "Cali",
    });

    try {
      await page.goto("/warehouses");
      await page.waitForURL("**/warehouses");

      await expect(page.getByRole("cell", { name: originalName })).toBeVisible();

      const row = page.getByRole("row").filter({ hasText: originalName });
      await row.getByTestId("warehouses-edit").click();

      await expect(
        page.getByRole("dialog").filter({ hasText: "Editar bodega" }),
      ).toBeVisible();

      const nameInput = page.getByPlaceholder("Nombre bodega");
      await expect(nameInput).toHaveValue(originalName, { timeout: 10000 });

      await nameInput.clear();
      await nameInput.fill(updatedName);

      await page.getByRole("button", { name: "Guardar cambios" }).click();

      await expect(
        page.getByRole("dialog").filter({ hasText: "Editar bodega" }),
      ).not.toBeVisible({ timeout: 10000 });

      await expect(page.getByRole("cell", { name: updatedName })).toBeVisible({
        timeout: 10000,
      });
    } finally {
      await removeWarehouse(authContext.api, id);
    }
  });

  test("Eliminar: desde la UI con confirmación", async ({
    page,
    authContext,
  }) => {
    const unique = `DEL-${TS}`;
    const name = `Bodega Delete ${TS}`;
    const id = await seedWarehouse(authContext.api, {
      name,
      code: unique,
      city: "Barranquilla",
    });

    await page.goto("/warehouses");
    await page.waitForURL("**/warehouses");

    await expect(page.getByRole("cell", { name })).toBeVisible();

    const row = page.getByRole("row").filter({ hasText: name });
    await row.getByTestId("warehouses-delete").click();

    await expect(
      page.getByRole("dialog").filter({ hasText: "Eliminar bodega" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Eliminar" }).click();

    await expect(
      page.getByRole("dialog").filter({ hasText: "Eliminar bodega" }),
    ).not.toBeVisible({ timeout: 10000 });

    await expect(page.getByRole("cell", { name })).not.toBeVisible({
      timeout: 10000,
    });
  });

  test("Búsqueda filtra por nombre", async ({ page, authContext }) => {
    const needle = `Alpha-${TS}`;
    const idA = await seedWarehouse(authContext.api, {
      name: `${needle} Almacen`,
      code: `S1-${TS}`,
    });
    const idB = await seedWarehouse(authContext.api, {
      name: `Beta ${TS}`,
      code: `S2-${TS}`,
    });

    try {
      await page.goto("/warehouses");
      await page.waitForURL("**/warehouses");

      await page.getByPlaceholder("Buscar por nombre...").fill(needle);

      await expect(page.getByRole("cell", { name: /Alpha/ })).toBeVisible();
      await expect(page.getByRole("cell", { name: /Beta/ })).not.toBeVisible();
    } finally {
      await removeWarehouse(authContext.api, idA);
      await removeWarehouse(authContext.api, idB);
    }
  });
});
