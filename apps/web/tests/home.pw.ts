import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waitForAppReady, waitForStyles } from "./helpers/ready";

const VIEWPORTS = [
  { width: 360, height: 640 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

test.describe("Portal homepage", () => {
  for (const viewport of VIEWPORTS) {
    test(`has no automatically detectable a11y issues at ${viewport.width}x${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await waitForStyles(page);

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });

    test(`has no horizontal overflow at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await waitForStyles(page);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );

      expect(overflow).toBe(false);
    });
  }

  test("Devanagari identity text is not clipped at 360px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto("/");
    await waitForStyles(page);

    // The header carries the Hindi product name; Devanagari matras sit above
    // and below the baseline, so the rendered box must exceed the font size.
    const hindiName = page.getByText("सुरंग साथी", { exact: true }).first();
    await expect(hindiName).toBeVisible();

    const clipped = await hindiName.evaluate((el) => ({
      overflowsY: el.scrollHeight > el.clientHeight + 1,
      overflowsX: el.scrollWidth > el.clientWidth + 1,
    }));

    expect(clipped.overflowsY).toBe(false);
    expect(clipped.overflowsX).toBe(false);
  });

  test("the text-size control is rendered exactly once", async ({ page }) => {
    await page.goto("/");
    await waitForAppReady(page);

    // Two instances would each hold their own React state and fight over the
    // root font-size, so aria-pressed would disagree between them.
    await expect(
      page.locator('[role="group"][aria-label="Text size"]')
    ).toHaveCount(1);
  });

  test("primary navigation collapses on mobile and expands on demand", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto("/");
    // click() waits for actionability but not for React to attach handlers, so
    // an un-gated click here silently does nothing on a slower machine.
    await waitForAppReady(page);

    const nav = page.getByRole("navigation", { name: "Primary" });
    const menu = nav.locator("#primary-nav-menu");
    const dashboardLink = nav.getByRole("link", { name: "Safety Dashboard" });
    const toggle = nav.getByRole("button", { name: /menu/i });

    // Collapsed by default.
    await expect(menu).toHaveAttribute("data-state", "collapsed");
    await expect(dashboardLink).toBeHidden();
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();

    await expect(menu).toHaveAttribute("data-state", "expanded");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(dashboardLink).toBeVisible();

    // And it collapses again, so this is a disclosure and not a one-way door.
    await toggle.click();
    await expect(dashboardLink).toBeHidden();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("primary navigation is laid out horizontally at 1440px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await waitForStyles(page);

    const nav = page.getByRole("navigation", { name: "Primary" });
    const home = nav.getByRole("link", { name: "Home", exact: true });
    const audit = nav.getByRole("link", { name: "Audit" });

    await expect(nav.getByRole("link", { name: "Safety Dashboard" })).toBeVisible();
    await expect(nav.getByRole("button", { name: /menu/i })).toBeHidden();
    await expect(home).toBeVisible();
    await expect(audit).toBeVisible();

    const homeBox = await home.boundingBox();
    const auditBox = await audit.boundingBox();

    expect(homeBox).not.toBeNull();
    expect(auditBox).not.toBeNull();
    // Same row, laid out left to right.
    expect(auditBox!.x).toBeGreaterThan(homeBox!.x);
    expect(Math.abs(auditBox!.y - homeBox!.y)).toBeLessThan(4);
  });

  test("interactive controls meet touch-target rules at 360px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto("/");
    await waitForStyles(page);

    // Hero calls to action are large field-primary targets.
    const hero = page.getByRole("region", { name: /Digital Safety/i });
    for (const name of ["Open Safety Dashboard", "View Compliance Status"]) {
      const cta = hero.getByRole("link", { name, exact: true });
      await expect(cta).toBeVisible();

      const box = await cta.boundingBox();
      expect(box, `${name} should render`).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(48);
    }

    // The nav disclosure is a primary mobile control.
    const toggle = page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("button", { name: /menu/i });
    await expect(toggle).toBeVisible();

    const menuBox = await toggle.boundingBox();
    expect(menuBox).not.toBeNull();
    expect(menuBox!.height).toBeGreaterThanOrEqual(48);
  });

  test("A+ text size actually enlarges the page and still fits 360px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto("/");
    await waitForAppReady(page);

    const heading = page.getByRole("heading", { level: 1 });
    const readSizes = () =>
      page.evaluate(() => ({
        root: parseFloat(getComputedStyle(document.documentElement).fontSize),
        h1: parseFloat(
          getComputedStyle(document.querySelector("h1")!).fontSize
        ),
      }));

    const before = await readSizes();

    const control = page.getByRole("group", { name: "Text size" });
    const larger = control.getByRole("button", { name: "Larger text size" });
    await expect(larger).toBeVisible();
    await larger.click();

    // The button reports its own state...
    await expect(larger).toHaveAttribute("aria-pressed", "true");
    // ...and the document genuinely reflows at a larger size.
    await expect
      .poll(async () => (await readSizes()).h1)
      .toBeGreaterThan(before.h1);

    const after = await readSizes();
    expect(after.root).toBeGreaterThan(before.root);
    expect(after.h1).toBeGreaterThan(before.h1);

    // And enlarging text must not break the narrow viewport.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });

  test("A- text size reduces the page without shrinking touch targets", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto("/");
    await waitForAppReady(page);

    const h1Size = () =>
      page.evaluate(() =>
        parseFloat(getComputedStyle(document.querySelector("h1")!).fontSize)
      );
    const before = await h1Size();

    await page
      .getByRole("group", { name: "Text size" })
      .getByRole("button", { name: "Smaller text size" })
      .click();

    await expect.poll(h1Size).toBeLessThan(before);

    // Worker touch targets are an absolute floor, so reducing text must not
    // pull the hero CTA below 48px even though its height is rem-based.
    const cta = page
      .getByRole("region", { name: /Digital Safety/i })
      .getByRole("link", { name: "Open Safety Dashboard", exact: true });
    const box = await cta.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(48);
  });

  test("does not present demo figures as live data", async ({ page }) => {
    await page.goto("/");
    await waitForStyles(page);

    const body = (await page.locator("body").innerText()).toLowerCase();

    expect(body).toContain("synthetic demo data");
    expect(body).not.toContain("live data");
    expect(body).not.toContain("real-time dgms");
  });

  test("states prototype status and claims no government endorsement", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForStyles(page);

    const body = await page.locator("body").innerText();

    expect(body).toContain("SIH 2026 prototype");
    expect(body).toMatch(/not an official Government of India/i);
  });

  test("risk score is never shown without contributing factors", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForStyles(page);

    const section = page.getByRole("region", {
      name: /Explainable Mine Risk Index/i,
    });

    await expect(section.getByText("74.2").first()).toBeVisible();
    await expect(section.getByText("High Risk").first()).toBeVisible();

    for (const factor of [
      "Overdue Corrective Actions",
      "Gas Threshold Breaches (30d)",
      "Inspection Coverage vs Target",
    ]) {
      await expect(section.getByText(factor).first()).toBeVisible();
    }
  });

  test("every core service card links to a real route", async ({ page }) => {
    await page.goto("/");
    await waitForStyles(page);

    const services = page.getByRole("region", { name: /Core services/i });
    const links = services.getByRole("link");

    const expected = [
      "/dashboard",
      "/hazards",
      "/inspections",
      "/corrective-actions",
      "/compliance",
      "/audit",
    ];

    const hrefs = await links.evaluateAll((els) =>
      els.map((el) => el.getAttribute("href"))
    );

    for (const href of expected) {
      expect(hrefs).toContain(href);
    }
    // No decorative anchors that go nowhere.
    expect(hrefs.every((href) => href && href !== "#")).toBe(true);
  });
});
