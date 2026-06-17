import { test as setup, expect } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
const AUTH_FILE = "playwright/.auth/user.json";

const USERNAME = process.env.E2E_USERNAME ?? "admin";
const PASSWORD = process.env.E2E_PASSWORD ?? "admin123";

setup("authenticate via API and seed localStorage", async ({ page, request }) => {
  const res = await request.post(`${API_BASE}/auth/login/`, {
    data: { username: USERNAME, password: PASSWORD },
  });
  expect(res.ok()).toBeTruthy();
  const { access, refresh } = await res.json();

  await page.goto(BASE_URL);
  await page.evaluate(
    ({ accessToken, refreshToken }) => {
      localStorage.setItem("access", accessToken);
      localStorage.setItem("refresh", refreshToken);
    },
    { accessToken: access, refreshToken: refresh },
  );

  await page.context().storageState({ path: AUTH_FILE });
});
