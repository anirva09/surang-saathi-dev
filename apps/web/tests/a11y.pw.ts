import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waitForStyles } from "./helpers/ready";

test.describe("Design System A11y", () => {
  const viewports = [
    { width: 360, height: 640 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ];

  for (const viewport of viewports) {
    test(`should not have any automatically detectable accessibility issues at ${viewport.width}x${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/design-system");
      await waitForStyles(page);

      const accessibilityScanResults = await new AxeBuilder({
        page,
      }).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test(`should not have horizontal overflow at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/design-system");
      await waitForStyles(page);

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(overflow).toBe(false);
    });
  }

  test("worker-facing touch targets should meet 40px/48px rules", async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 360,
      height: 640,
    });

    await page.goto("/design-system");
    // boundingBox() does not retry, so measuring before the stylesheet lands
    // reports the unstyled box (36px rows, 17px buttons) and fails a page that
    // is in fact correct.
    await waitForStyles(page);

    const choiceRows = page
      .getByTestId("worker-touch-targets")
      .locator('label:has(input[type="radio"])');

    await expect(choiceRows).toHaveCount(2);

    for (let i = 0; i < (await choiceRows.count()); i++) {
      const box = await choiceRows.nth(i).boundingBox();

      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(48);
    }

    // Bound to the size contract rather than to a utility class, so the 48px
    // requirement survives a styling refactor.
    const lgButtons = page.locator('button[data-size="lg"]');

    await expect(lgButtons).not.toHaveCount(0);

    for (let i = 0; i < (await lgButtons.count()); i++) {
      const box = await lgButtons.nth(i).boundingBox();

      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(48);
    }
  });
});
