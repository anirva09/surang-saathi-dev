import type { Page } from "@playwright/test";

/**
 * Whether the Surang Saathi API is reachable from the test run.
 *
 * The workspace screens read live data, so their content assertions need a
 * backend. Rather than skip them blindly — or worse, make the suite green by
 * asserting nothing — the suite asks once and then runs a different set of real
 * assertions for each case:
 *
 *   backend up   → the data assertions run against the seeded Golden Workflow.
 *   backend down → the honest-failure assertions run instead, proving the page
 *                  reports the outage and substitutes no demonstration figures.
 *
 * The accessibility and layout gates run either way, against whichever state
 * the page is actually in.
 */

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";

let cached: boolean | null = null;

export async function backendIsUp(): Promise<boolean> {
  if (cached !== null) return cached;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(`${API_BASE_URL}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    cached = response.ok;
  } catch {
    cached = false;
  }

  return cached;
}

/** The mine the backend seeds, and the one the frontend is configured to read. */
export const SEEDED = {
  mineId: process.env.DEMO_MINE_ID ?? "MINE-03",
  mineName: "Demo Mine 03",
  areaName: "Jharia Area",
  hazardId: "HZRD-2026-442",
  hazardTitle: "Roof support damage observed",
  hazardLocation: "Seam 2, Main Gallery",
  actionId: "ACT-2026-118",
  evidenceId: "EVD-HZRD-442-001",
  riskScore: "74.2",
  riskLevel: "HIGH",
  reporterName: "Rajesh Kumar (Sirdar)",
  managerName: "M. Sharma",
} as const;

/**
 * The page-level API failure state. It is a labelled region rather than an
 * alert — a server-rendered "nothing to show" is page content, not an
 * interruption — so it is located the way a user would reach it: by the heading
 * that names the failure.
 */
export function apiErrorRegion(page: Page) {
  return page.locator("section").filter({
    has: page.locator("#api-error-title"),
  });
}

/** True when the page is showing the API-failure state rather than data. */
export async function showsApiFailure(page: Page): Promise<boolean> {
  return (await apiErrorRegion(page).count()) > 0;
}
