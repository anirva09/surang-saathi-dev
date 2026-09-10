import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waitForAppReady, waitForStyles } from "./helpers/ready";

/**
 * Public homepage — Golden Master.
 *
 * Replaces the previous portal-homepage suite. The layout assertions changed
 * because the page architecture changed; the accessibility, readiness and
 * honesty assertions carry over unchanged, because those are about the
 * product's integrity rather than its visual direction.
 */

const VIEWPORTS = [
  { width: 360, height: 640 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

test.describe("Public homepage", () => {
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

  test("renders every Golden Master section in order", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await waitForStyles(page);

    // Government utility strip
    await expect(page.getByText("Government of India").first()).toBeVisible();
    await expect(page.getByText("Ministry of Coal").first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Skip to main content" })
    ).toBeVisible();

    // Hero
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText("Empowering People.");
    await expect(h1).toContainText("Safer Mines. Stronger Tomorrow.");

    // Stats strip, key features, credibility band, footer
    await expect(
      page.getByRole("region", { name: /Platform statistics/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Key Features" })
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: /About Surang Saathi/i })
    ).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("shows the four Golden Master statistics", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await waitForStyles(page);

    const strip = page.getByRole("region", { name: /Platform statistics/i });

    for (const [value, label] of [
      ["12.4 lakh", "Inspections Recorded"],
      ["8,932", "Hazards Identified"],
      ["1.8 lakh", "Field Users"],
      ["92%", "Issues Resolved"],
    ]) {
      const item = strip.getByRole("listitem").filter({ hasText: label }).first();
      await expect(item).toContainText(value);
    }
  });

  test("shows the five Key Features cards", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await waitForStyles(page);

    const features = page.getByRole("region", { name: "Key Features" });
    await expect(features.getByRole("listitem")).toHaveCount(5);

    for (const title of [
      "Digital Inspections",
      "Safety Analytics",
      "Accountability",
      "Geo-verified Evidence",
      "Regulatory Compliance",
    ]) {
      await expect(
        features.getByRole("heading", { level: 3, name: title })
      ).toBeVisible();
    }
  });

  test("hero calls to action are present and meet touch targets", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto("/");
    await waitForStyles(page);

    const hero = page.getByRole("region", { name: /Empowering People/i });

    for (const name of ["Get Started", "Know More"]) {
      const cta = hero.getByRole("link", { name, exact: true });
      await expect(cta).toBeVisible();

      const box = await cta.boundingBox();
      expect(box, `${name} should render`).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(48);
    }
  });

  test("Login to Portal routes to the dashboard", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await waitForStyles(page);

    const login = page
      .getByRole("banner")
      .getByRole("link", { name: /Login to Portal/i });

    await expect(login).toBeVisible();
    await expect(login).toHaveAttribute("href", "/dashboard");

    await login.click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("navigation collapses on mobile and expands on demand", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto("/");
    await waitForAppReady(page);

    const panel = page.locator("#mobile-nav-panel");
    const aboutLink = panel.getByRole("link", { name: "About" });
    const toggle = page.getByRole("button", { name: /menu/i });

    await expect(panel).toHaveAttribute("data-state", "collapsed");
    await expect(aboutLink).toBeHidden();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();

    await expect(panel).toHaveAttribute("data-state", "expanded");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(aboutLink).toBeVisible();

    // Mobile nav targets are full-width rows, not shrunk desktop links.
    const box = await aboutLink.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(48);
  });

  test("desktop navigation is a horizontal row at 1440px", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await waitForStyles(page);

    const nav = page.getByRole("navigation", { name: "Primary" });
    const home = nav.getByRole("link", { name: "Home", exact: true });
    const contact = nav.getByRole("link", { name: "Contact", exact: true });

    await expect(home).toBeVisible();
    await expect(contact).toBeVisible();
    await expect(home).toHaveAttribute("aria-current", "page");

    const homeBox = await home.boundingBox();
    const contactBox = await contact.boundingBox();
    expect(contactBox!.x).toBeGreaterThan(homeBox!.x);
    expect(Math.abs(contactBox!.y - homeBox!.y)).toBeLessThan(4);
  });

  test("both hero and band imagery have meaningful alt text", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await waitForStyles(page);

    const images = page.getByRole("img").filter({ visible: true });
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(2);

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt, "every content image needs alt text").toBeTruthy();
      expect(alt!.length).toBeGreaterThan(20);
    }
  });

  /* ── Honesty (carried over from the previous suite, unchanged in intent) ── */

  test("does not present illustrative figures as live data", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForStyles(page);

    const body = (await page.locator("body").innerText()).toLowerCase();

    expect(body).toContain("illustrative prototype figures");
    expect(body).not.toContain("live data across mines");
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
    expect(body).toMatch(/no government endorsement/i);
  });

  test("does not reproduce government programme marks or attributed quotes", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForStyles(page);

    const body = (await page.locator("body").innerText()).toLowerCase();

    // The Golden Master carries a Digital India mark and a quote attributed to
    // the Ministry of Coal. Neither may appear on a student prototype.
    expect(body).not.toContain("digital india");
    expect(body).not.toContain("— ministry of coal");
    expect(body).not.toContain("power to empower");
  });

  test("the text-size control is rendered exactly once and works", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto("/");
    await waitForAppReady(page);

    await expect(
      page.locator('[role="group"][aria-label="Text size"]')
    ).toHaveCount(1);

    const h1Size = () =>
      page.evaluate(() =>
        parseFloat(getComputedStyle(document.querySelector("h1")!).fontSize)
      );
    const before = await h1Size();

    await page
      .getByRole("group", { name: "Text size" })
      .getByRole("button", { name: "Larger text size" })
      .click();

    await expect.poll(h1Size).toBeGreaterThan(before);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });

  test("no navigation link is a decorative dead end", async ({ page }) => {
    await page.goto("/");
    await waitForStyles(page);

    const hrefs = await page
      .getByRole("banner")
      .getByRole("link")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href")));

    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href, "links must have a real destination").toBeTruthy();
      expect(href).not.toBe("#");
    }
  });
});
