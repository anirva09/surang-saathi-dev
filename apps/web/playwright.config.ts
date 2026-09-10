import { defineConfig, devices } from '@playwright/test';

// A dedicated port so the suite never attaches to a dev server the developer
// happens to have running on 3000 from another checkout or an older build.
const PORT = Number(process.env.A11Y_PORT ?? 3010);
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests',
  // Playwright owns only *.pw.ts. Vitest owns *.test.tsx.
  // Without this, components.test.tsx would be collected as a Playwright spec.
  testMatch: '**/*.pw.ts',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  // A cold `next dev` compile on Windows can exceed the 30s default well
  // before anything is actually wrong.
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Playwright owns the dev-server lifecycle so `npm run a11y` is a single
  // command. reuseExistingServer is off deliberately: reusing a stale server
  // silently tests the wrong build, which is far more expensive to debug than
  // the few seconds a fresh start costs.
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 240_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
