import { test as base, type APIRequestContext } from "@playwright/test";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

interface AuthContext {
  api: APIRequestContext;
  seed: (endpoint: string, payload: Record<string, unknown>) => Promise<number>;
  remove: (endpoint: string, id: number) => Promise<void>;
}

export const test = base.extend<{ authContext: AuthContext }>({
  authContext: async ({ playwright, request }, use) => {
    const res = await request.post(`${API_BASE}/auth/login/`, {
      data: {
        username: process.env.E2E_USERNAME ?? "admin",
        password: process.env.E2E_PASSWORD ?? "admin123",
      },
    });
    const { access } = await res.json();

    const api = await playwright.request.newContext({
      baseURL: API_BASE,
      extraHTTPHeaders: { Authorization: `Bearer ${access}` },
    });

    const seed = async (endpoint: string, payload: Record<string, unknown>): Promise<number> => {
      const r = await api.post(`/${endpoint}/`, { data: payload });
      const body = await r.json();
      return body.id;
    };

    const remove = async (endpoint: string, id: number): Promise<void> => {
      await api.delete(`/${endpoint}/${id}/`);
    };

    await use({ api, seed, remove });
    await api.dispose();
  },
});

export { expect } from "@playwright/test";
