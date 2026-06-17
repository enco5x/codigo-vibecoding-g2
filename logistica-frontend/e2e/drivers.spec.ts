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
  return { Authorization: `Bearer ${token}` };
}

async function apiGet(request: any, token: string, path: string) {
  const r = await request.get(`${API}${path}`, {
    headers: authHeaders(token),
  });
  return r.json();
}

async function apiPost(request: any, token: string, path: string, data: Record<string, unknown>) {
  const r = await request.post(`${API}${path}`, {
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    data,
  });
  return r.json();
}

async function apiDelete(request: any, token: string, path: string) {
  await request.delete(`${API}${path}`, {
    headers: authHeaders(token),
  });
}

async function findDriverByLicense(request: any, token: string, license: string): Promise<number | undefined> {
  const list = await apiGet(request, token, "/drivers/?page=1");
  const found = list.results?.find((d: { license_number: string }) => d.license_number === license);
  return found?.id;
}

async function seedDriver(request: any, token: string, payload: Record<string, unknown>): Promise<{ id: number; license_number: string }> {
  await apiPost(request, token, "/drivers/", payload);
  const license = payload.license_number as string;
  const id = await findDriverByLicense(request, token, license);
  if (!id) throw new Error(`Driver with license ${license} not found after creation`);
  return { id, license_number: license };
}

test.describe("Drivers CRUD", () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await login(request);
  });

  test("Lista carga y renderiza la tabla con datos sembrados", async ({
    page,
    request,
  }) => {
    const lic = `LIC-LIST-${TS}`;
    const phone = `+57 300 ${String(TS).slice(-3)}-${String(TS).slice(-4)}`;
    const { id } = await seedDriver(request, token, {
      license_number: lic,
      phone,
      email: `list-${TS}@mail.com`,
      is_available: true,
    });

    try {
      await page.goto("/drivers");
      await page.waitForURL("**/drivers");

      await expect(
        page.getByRole("heading", { name: "Conductores" }),
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "Licencia" }),
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "Teléfono" }),
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "Email" }),
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "Disponible" }),
      ).toBeVisible();

      await expect(page.getByRole("cell", { name: lic })).toBeVisible();
      await expect(page.getByRole("cell", { name: phone })).toBeVisible();
    } finally {
      await apiDelete(request, token, `/drivers/${id}/`);
    }
  });

  test("Crear: formulario válido", async ({ page, request }) => {
    const lic = `LIC-CR-${TS}`;
    let createdId: number | null = null;

    try {
      await page.goto("/drivers");
      await page.waitForURL("**/drivers");

      await page.getByRole("button", { name: "Nuevo conductor" }).click();

      await expect(
        page.getByRole("dialog").filter({ hasText: "Nuevo conductor" }),
      ).toBeVisible();

      await page.locator("#license_number").fill(lic);
      await page.locator("#phone").fill("+57 310 9999999");
      await page.locator("#email").fill(`create-${TS}@mail.com`);

      await page.getByRole("button", { name: "Guardar cambios" }).click();

      await expect(
        page.getByRole("dialog").filter({ hasText: "Nuevo conductor" }),
      ).not.toBeVisible({ timeout: 10000 });

      await expect(page.getByRole("cell", { name: lic })).toBeVisible({
        timeout: 10000,
      });

      createdId = await findDriverByLicense(request, token, lic) ?? null;
    } finally {
      if (createdId) await apiDelete(request, token, `/drivers/${createdId}/`);
    }
  });

  test("Validación: enviar vacío no crea nada", async ({
    page,
    request,
  }) => {
    const countBefore = (await apiGet(request, token, "/drivers/")).count;

    await page.goto("/drivers");
    await page.waitForURL("**/drivers");

    await page.getByRole("button", { name: "Nuevo conductor" }).click();
    await expect(
      page.getByRole("dialog").filter({ hasText: "Nuevo conductor" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await expect(
      page.getByRole("dialog").filter({ hasText: "Nuevo conductor" }),
    ).toBeVisible({ timeout: 5000 });

    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(
      page.getByRole("dialog").filter({ hasText: "Nuevo conductor" }),
    ).not.toBeVisible();

    const countAfter = (await apiGet(request, token, "/drivers/")).count;
    expect(countAfter).toBe(countBefore);
  });

  test("Editar: cambiar licencia y verificar el cambio", async ({
    page,
    request,
  }) => {
    const originalLic = `LIC-ED-${TS}`;
    const updatedLic = `LIC-ED-NEW-${TS}`;
    const { id } = await seedDriver(request, token, {
      license_number: originalLic,
      phone: "+57 320 0000000",
    });

    try {
      await page.goto("/drivers");
      await page.waitForURL("**/drivers");

      await expect(page.getByRole("cell", { name: originalLic })).toBeVisible();

      const row = page.getByRole("row").filter({ hasText: originalLic });
      await row.getByTestId("drivers-edit").click();

      await expect(
        page.getByRole("dialog").filter({ hasText: "Editar conductor" }),
      ).toBeVisible();

      const licInput = page.locator("#license_number");
      await expect(licInput).toHaveValue(originalLic, { timeout: 10000 });

      await licInput.clear();
      await licInput.fill(updatedLic);

      await page.getByRole("button", { name: "Guardar cambios" }).click();

      await expect(
        page.getByRole("dialog").filter({ hasText: "Editar conductor" }),
      ).not.toBeVisible({ timeout: 10000 });

      await expect(
        page.getByRole("cell", { name: updatedLic }),
      ).toBeVisible({ timeout: 10000 });
    } finally {
      await apiDelete(request, token, `/drivers/${id}/`);
    }
  });

  test("Eliminar: desde la UI con confirmación", async ({
    page,
    request,
  }) => {
    const lic = `LIC-DEL-${TS}`;
    const { id } = await seedDriver(request, token, { license_number: lic });

    await page.goto("/drivers");
    await page.waitForURL("**/drivers");

    await expect(page.getByRole("cell", { name: lic })).toBeVisible();

    const row = page.getByRole("row").filter({ hasText: lic });
    await row.getByTestId("drivers-delete").click();

    await expect(
      page.getByRole("dialog").filter({ hasText: "Eliminar conductor" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Eliminar" }).click();

    await expect(
      page.getByRole("dialog").filter({ hasText: "Eliminar conductor" }),
    ).not.toBeVisible({ timeout: 10000 });

    await expect(page.getByRole("cell", { name: lic })).not.toBeVisible({
      timeout: 10000,
    });
  });

  test("Búsqueda filtra por licencia, teléfono o email", async ({
    page,
    request,
  }) => {
    const needle = `FindDriver-${TS}`;
    const { id: idA } = await seedDriver(request, token, {
      license_number: needle,
      phone: "+57 333 1111111",
      email: `found-${TS}@mail.com`,
    });
    const { id: idB } = await seedDriver(request, token, {
      license_number: `OTHER-${TS}`,
      phone: "+57 344 2222222",
    });

    try {
      await page.goto("/drivers");
      await page.waitForURL("**/drivers");

      await page.getByPlaceholder("Buscar por licencia, teléfono o email...").fill(needle);

      await expect(page.getByRole("cell", { name: needle })).toBeVisible();
      await expect(page.getByRole("cell", { name: `OTHER-${TS}` })).not.toBeVisible();
    } finally {
      await apiDelete(request, token, `/drivers/${idA}/`);
      await apiDelete(request, token, `/drivers/${idB}/`);
    }
  });
});
