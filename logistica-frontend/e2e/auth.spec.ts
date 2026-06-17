import { test, expect } from "@playwright/test";

const USERNAME = process.env.E2E_USERNAME ?? "admin";
const PASSWORD = process.env.E2E_PASSWORD ?? "admin123";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

test.describe("Login", () => {
  test.skip(
    () => test.info().project.name !== "login-chromium",
    "Run without storageState",
  );

  test("valid credentials → redirects to /dashboard with Sidebar and Navbar", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.locator("#username").pressSequentially(USERNAME);
    await page.locator("#password").pressSequentially(PASSWORD);
    await page.click("button[type='submit']");

    await page.waitForURL("**/dashboard", { timeout: 10000 });

    await expect(
      page.getByRole("heading", { name: "Panel de control" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Dashboard" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Cerrar sesión" }).first(),
    ).toBeVisible();
  });

  test("invalid credentials → shows error, stays on /login", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.locator("#username").pressSequentially("invalid_user");
    await page.locator("#password").pressSequentially("wrong_password");

    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/auth/login/") && res.status() === 401,
      ),
      page.click("button[type='submit']"),
    ]);

    await expect(
      page.getByText(/No active account/i),
    ).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("AuthGuard", () => {
  test.skip(
    () => test.info().project.name !== "login-chromium",
    "Run without storageState",
  );

  test("no token in localStorage → protected route redirects to /login", async ({
    page,
  }) => {
    await page.goto("/warehouses");
    await page.waitForURL("**/login", { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Authenticated session", () => {
  test.skip(
    () => test.info().project.name !== "chromium",
    "Run with storageState",
  );

  test("logout clears tokens and redirects to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/dashboard");

    await page.getByRole("button", { name: "Cerrar sesión" }).first().click();
    await page.waitForURL("**/login", { timeout: 10000 });

    const access = await page.evaluate(() => localStorage.getItem("access"));
    const refresh = await page.evaluate(() => localStorage.getItem("refresh"));
    expect(access).toBeNull();
    expect(refresh).toBeNull();

    await page.goto("/warehouses");
    await page.waitForURL("**/login", { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("token refresh on 401 retries without expelling user", async ({
    page,
  }) => {
    const res = await page.request.post(`${API_BASE}/auth/login/`, {
      data: { username: USERNAME, password: PASSWORD },
    });
    const { refresh } = await res.json();

    await page.goto("/dashboard");
    await page.waitForURL("**/dashboard");

    await page.evaluate((validRefresh: string) => {
      localStorage.setItem("access", "Bearer expired_or_invalid_token");
      localStorage.setItem("refresh", validRefresh);
    }, refresh);

    await page.goto("/warehouses");

    await expect(page).toHaveURL(/\/warehouses/, { timeout: 15000 });
    await expect(page.getByText("Bodegas")).toBeVisible({ timeout: 15000 });
  });
});
