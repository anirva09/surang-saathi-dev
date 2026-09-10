import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waitForStyles } from "./helpers/ready";

const VIEWPORTS = [
  { width: 360, height: 640 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

test.describe("Manager safety dashboard", () => {
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

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  }

  test("loads with a single h1 and the expected section headings", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await waitForStyles(page);

    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Safety Dashboard");

    for (const heading of [
      "Priority Actions",
      "Mine Risk Index",
      "Compliance Deadlines",
      "Sync & Evidence Exceptions",
      "Recent Safety Activity",
    ]) {
      await expect(
        page.getByRole("heading", { level: 2, name: heading, exact: true })
      ).toBeVisible();
    }
  });

  test("shows exactly four primary KPIs with their operational context", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/dashboard");
    await waitForStyles(page);

    const kpis = page
      .getByRole("region", { name: /Priority indicators/i })
      .getByRole("listitem");

    // Four is the contract — a fifth card dilutes the decision surface.
    await expect(kpis).toHaveCount(4);

    for (const [label, value, context] of [
      ["High-Risk Hazards", "3", "2 escalated"],
      ["Overdue Corrective Actions", "5", "Oldest: 2 days overdue"],
      ["Pending Reviews", "4", "2 with evidence conflicts"],
      ["Inspections Due Today", "7", "3 completed this shift"],
    ]) {
      const card = kpis.filter({ hasText: label }).first();
      await expect(card).toContainText(value);
      await expect(card).toContainText(context);
    }
  });

  test("priority queue leads with the escalated golden hazard", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await waitForStyles(page);

    const queue = page.getByRole("region", { name: "Priority Actions" });
    const rows = queue.getByRole("listitem");
    await expect(rows).toHaveCount(4);

    const first = rows.first();
    await expect(first).toContainText("HZRD-2026-442");
    await expect(first).toContainText("Roof support damage observed");
    await expect(first).toContainText("Seam 2, Main Gallery");
    // Accountability and urgency are on the row, not behind a detail page.
    await expect(first).toContainText("M. Sharma");
    await expect(first).toContainText("2 days overdue");
    await expect(first).toContainText("High severity");
    await expect(first).toContainText("Escalated");
    // Evidence integrity is visible too.
    await expect(first).toContainText("Sync Conflict");
    await expect(first).toContainText("Location conflict");
  });

  test("every priority row names an owner and a human-readable due state", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await waitForStyles(page);

    const rows = page
      .getByRole("region", { name: "Priority Actions" })
      .getByRole("listitem");

    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toContainText("Owner:");
      // A bare calendar date is never enough for an urgent item.
      await expect(rows.nth(i)).toContainText(
        /overdue|Due today|Due in \d+ days?|Awaiting review/
      );
    }
  });

  test("risk index is never shown without its factors, weights and method", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await waitForStyles(page);

    const panel = page.getByRole("region", { name: "Mine Risk Index" });

    await expect(panel).toContainText("74.2");
    await expect(panel).toContainText("High Risk");

    for (const factor of [
      "Overdue Corrective Actions",
      "Gas Threshold Breaches (30d)",
      "Inspection Coverage vs Target",
    ]) {
      await expect(panel.getByText(factor).first()).toBeVisible();
    }

    // Weights are published so a manager can argue with the score.
    await expect(panel).toContainText("40% weight");
    await expect(panel).toContainText("35% weight");
    await expect(panel).toContainText("25% weight");

    // Rule-based, and not dressed up as machine learning.
    await expect(panel).toContainText(/rule-based/i);
    const panelText = await panel.innerText();
    expect(panelText.toLowerCase()).not.toContain("ai-powered");
    expect(panelText.toLowerCase()).not.toContain("prediction");
  });

  test("queued offline capture is not presented as a failure", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await waitForStyles(page);

    const exceptions = page.getByRole("region", {
      name: "Sync & Evidence Exceptions",
    });
    const queued = exceptions
      .getByRole("listitem")
      .filter({ hasText: "HZRD-2026-431" });

    await expect(queued).toContainText("Queued for sync");
    // OFFLINE/QUEUED is a normal field condition on a mine with no signal.
    const colour = await queued
      .locator("text=Queued for sync")
      .first()
      .evaluate((el) => getComputedStyle(el.parentElement!).color);
    // dangerInk #A53A24 -> rgb(165, 58, 36)
    expect(colour).not.toBe("rgb(165, 58, 36)");

    // A genuine conflict, by contrast, is called out explicitly.
    await expect(
      exceptions.getByRole("listitem").filter({ hasText: "HZRD-2026-442" })
    ).toContainText("Sync Conflict");
  });

  test("mobile action targets stay usable at 360px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto("/dashboard");
    await waitForStyles(page);

    const review = page
      .getByRole("region", { name: "Priority Actions" })
      .getByRole("link", { name: /Review hazard HZRD-2026-442/i });

    await expect(review).toBeVisible();
    const box = await review.boundingBox();
    expect(box).not.toBeNull();
    // Manager mobile actions need at least 40px; 32px dense controls are
    // desktop-only utilities.
    expect(box!.height).toBeGreaterThanOrEqual(40);
  });

  test("the dashboard is reachable from the portal shell", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await waitForStyles(page);

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Safety Dashboard" })
      .click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Safety Dashboard"
    );

    // And the nav marks it as the current page.
    await expect(
      page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name: "Safety Dashboard" })
    ).toHaveAttribute("aria-current", "page");
  });

  test("does not present demo figures as live data", async ({ page }) => {
    await page.goto("/dashboard");
    await waitForStyles(page);

    const body = (await page.locator("body").innerText()).toLowerCase();

    expect(body).toContain("synthetic demo data");
    expect(body).not.toContain("live data");
  });
});
