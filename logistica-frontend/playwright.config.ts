/**
 * Playwright E2E Configuration
 *
 * Prerequisites:
 * 1. Backend Django server running on http://localhost:8000
 * 2. Frontend Next.js server running on http://localhost:3000
 * 3. A test user exists in the backend database.
 *    Suggested Django management command to create one:
 *      cd ../logistica-api
 *      python manage.py create_test_user
 *    Or using createsuperuser:
 *      python manage.py createsuperuser --username admin --email admin@test.com
 *    Then set password via: python manage.py changepassword admin
 *
 * Default test credentials (configurable via env vars):
 *   E2E_USERNAME=admin
 *   E2E_PASSWORD=admin123
 *
 * NOTE: No webServer configured. Servers must be started manually.
 */

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "login-chromium",
      testMatch: /auth\.spec\.ts/,
    },
    {
      name: "chromium",
      dependencies: ["setup"],
      use: {
        storageState: "playwright/.auth/user.json",
      },
    },
  ],
});
