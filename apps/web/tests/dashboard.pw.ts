import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waitForStyles } from "./helpers/ready";
import { apiErrorRegion, backendIsUp, SEEDED } from "./helpers/backend";

/**
 * The manager safety dashboard, integrated against the frozen backend contract.
 *
 * The dashboard answers four questions — what is unsafe, what is overdue, who
 * owns it, what needs action now — from live API data. These tests hold the
 * invariants that survived the integration (accessibility, layout, exactly four
 * KPIs, risk never shown without its method) and add the one the integration
 * introduced: when the API is down the page must say so and must NOT fall back
 * to demonstration figures.
 */

const VIEWPORTS = [
  { width: 360, height: 640 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

test.describe("Dashboard — invariants that hold in every state", () => {
  for (const viewport of VIEWPORTS) {
    test(`has no horizontal overflow at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/dashboard");
      await waitForStyles(page);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );

      expect(overflow).toBe(false);
    });
  }

  // axe at the two ends of the range rather than all three, to keep the gate fast.
  for (const viewport of [VIEWPORTS[0], VIEWPORTS[2]]) {
    test(`has no automatically detectable a11y issues at ${viewport.width}x${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/dashboard");
      await waitForStyles(page);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }

  test("has exactly one h1 and a main landmark", async ({ page }) => {
    await page.goto("/dashboard");
    await waitForStyles(page);

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveCount(1);
  });

  test("is reachable from the public shell", async ({ page }) => {
    await page.goto("/");
    await waitForStyles(page);

    await page
      .getByRole("link", { name: /Login to Portal/ })
      .first()
      .click();

    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("keeps the workspace navigation keyboard reachable at 360px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto("/dashboard");
    await waitForStyles(page);

    const nav = page.getByRole("navigation", { name: "Workspace" });
    const hazards = nav.getByRole("link", { name: "Hazards", exact: true });

    await hazards.focus();
    await expect(hazards).toBeFocused();

    // Government touch-target floor, enforced rather than assumed.
    const box = await hazards.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(40);
  });

  test("never claims the risk index is predictive or AI-driven", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await waitForStyles(page);

    const body = (await page.locator("body").innerText()).toLowerCase();
    expect(body).not.toContain("ai-powered");
    expect(body).not.toContain("ai-driven");
    expect(body).not.toContain("prediction");
    expect(body).not.toContain("predictive");
  });

  test("never claims government endorsement or deployment", async ({ page }) => {
    await page.goto("/dashboard");
    await waitForStyles(page);

    const body = (await page.locator("body").innerText()).toLowerCase();
    // The prototype notice must still be the thing that sets expectations.
    expect(body).toContain("prototype");
    expect(body).not.toContain("approved by the government");
    expect(body).not.toContain("officially deployed");
    expect(body).not.toContain("digital india endorsed");
  });
});

test.describe("Dashboard — with the API reachable", () => {
  // test.skip() needs a synchronous condition, so the probe runs once up front.
  let apiUp = false;
  test.beforeAll(async () => {
    apiUp = await backendIsUp();
  });
  test.beforeEach(() => {
    test.skip(
      !apiUp,
      "The Surang Saathi API is not reachable; the honest-failure suite covers this run instead."
    );
  });

  test("names the mine the figures belong to", async ({ page }) => {
    await page.goto("/dashboard");
    await waitForStyles(page);

    const main = page.getByRole("main");
    await expect(main).toContainText(SEEDED.mineName);
    await expect(main).toContainText(SEEDED.areaName);
    await expect(main).toContainText(SEEDED.mineId);
  });

  test("shows exactly four KPIs, each with its own explanation", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await waitForStyles(page);

    const tiles = page
      .getByRole("region", { name: "Current safety position" })
      .getByRole("listitem");

    // Four, because the contract's DashboardKpisOut declares exactly four.
    await expect(tiles).toHaveCount(4);

    for (const label of [
      "Open hazards",
      "High-severity hazards",
      "Overdue actions",
      "Evidence conflicts",
    ]) {
      await expect(tiles.filter({ hasText: label })).toHaveCount(1);
    }

    // A bare number with no explanation is not decision-support.
    for (let i = 0; i < 4; i += 1) {
      const text = await tiles.nth(i).innerText();
      expect(text).toMatch(/\d/);
      expect(text.split("\n").filter(Boolean).length).toBeGreaterThan(2);
    }
  });

  test("risk is never shown without its level, factors and weights", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await waitForStyles(page);

    const panel = page.getByRole("region", { name: "Mine risk index" });
    await expect(panel).toContainText(SEEDED.riskScore);
    await expect(panel).toContainText(SEEDED.riskLevel);

    // Every factor carries a weight, so the score is explainable.
    const weights = panel.getByText(/Weight: \d+%/);
    expect(await weights.count()).toBeGreaterThan(0);
  });

  test("the attention list links through to the hazard it names", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await waitForStyles(page);

    const link = page
      .getByRole("link", { name: `Open hazard ${SEEDED.hazardId}` })
      .first();
    await expect(link).toBeVisible();

    await link.click();
    await expect(page).toHaveURL(new RegExp(`/hazards/${SEEDED.hazardId}$`));
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      SEEDED.hazardTitle
    );
  });

  test("a KPI links to the register filtered the way it reads", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await waitForStyles(page);

    await page
      .getByRole("listitem")
      .filter({ hasText: "High-severity hazards" })
      .getByRole("link")
      .first()
      .click();

    await expect(page).toHaveURL(/\/hazards\?severity=HIGH$/);
    // The filter really is applied, not just present in the URL.
    await expect(
      page.getByLabel("Severity", { exact: true })
    ).toHaveValue("HIGH");
  });
});

test.describe("Dashboard — with the API unreachable", () => {
  let apiUp = false;
  test.beforeAll(async () => {
    apiUp = await backendIsUp();
  });
  test.beforeEach(() => {
    test.skip(
      apiUp,
      "The API is reachable, so the failure path cannot be observed in this run."
    );
  });

  test("reports the outage instead of rendering a dashboard", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await waitForStyles(page);

    const state = apiErrorRegion(page);
    await expect(state).toBeVisible();
    await expect(state).toContainText("The safety API could not be reached");

    // The failure is traceable: the code the client raised is on the page.
    await expect(state).toContainText("NETWORK_ERROR");

    // It is the page's own h1, so the outage is the heading, not a footnote.
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "The safety API could not be reached"
    );
  });

  test("substitutes no demonstration figures for the data it could not load", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await waitForStyles(page);

    const body = await page.getByRole("main").innerText();

    // None of the seeded values may appear: a dashboard that invents its
    // numbers when the backend is down is worse than one that admits it has none.
    expect(body).not.toContain(SEEDED.riskScore);
    expect(body).not.toContain(SEEDED.hazardId);
    expect(body).not.toContain(SEEDED.mineName);
    expect(body).not.toContain(SEEDED.managerName);

    // And no KPI tiles are rendered at all.
    await expect(
      page.getByRole("region", { name: "Current safety position" })
    ).toHaveCount(0);
  });

  test("the failure state is itself accessible", async ({ page }) => {
    await page.goto("/dashboard");
    await waitForStyles(page);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
