import { test, expect } from "@playwright/test";
import { waitForAppReady, waitForStyles } from "./helpers/ready";

/**
 * Localization policy.
 *
 * English is the default and the ONLY language rendered until the user
 * explicitly selects Hindi. The sole Devanagari permitted in English mode is
 * the "हिन्दी" option on the language control itself.
 */

// Devanagari block. Any match outside the language control in English mode is
// a policy violation.
const DEVANAGARI = /[ऀ-ॿ]/;

async function bodyTextWithoutLanguageControl(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const clone = document.body.cloneNode(true) as HTMLElement;
    clone
      .querySelectorAll('[role="group"][aria-label]')
      .forEach((group) => {
        const label = group.getAttribute("aria-label") ?? "";
        // Drop the language selector in whichever language labels it.
        if (/language|भाषा/i.test(label)) group.remove();
      });
    return clone.innerText;
  });
}

test.describe("Interface language", () => {
  test("defaults to English with no Hindi anywhere but the language control", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForAppReady(page);

    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    const text = await bodyTextWithoutLanguageControl(page);
    expect(
      DEVANAGARI.test(text),
      "English mode must not render Devanagari outside the language control"
    ).toBe(false);

    // And the interface really is in English.
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Empowering People."
    );
    await expect(
      page.getByRole("navigation", { name: "Primary" }).getByRole("link", {
        name: "Home",
        exact: true,
      })
    ).toBeVisible();
  });

  test("the language control offers Hindi while English is active", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForAppReady(page);

    const group = page.getByRole("group", { name: "Interface language" });
    await expect(group.getByRole("button", { name: /English/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await expect(group.getByRole("button", { name: /हिन्दी/ })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  test("selecting Hindi translates the interface and sets html lang", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForAppReady(page);

    await page
      .getByRole("group", { name: "Interface language" })
      .getByRole("button", { name: /हिन्दी/ })
      .click();

    await expect(page.locator("html")).toHaveAttribute("lang", "hi");

    // Navigation, headline and buttons all move to Hindi.
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "लोगों को सशक्त बनाना।"
    );
    await expect(
      page.getByRole("navigation", { name: "मुख्य" }).getByRole("link", {
        name: "मुख्य पृष्ठ",
        exact: true,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /पोर्टल में लॉगिन/ }).first()
    ).toBeVisible();

    // And no English interface copy is left behind alongside it.
    const text = await bodyTextWithoutLanguageControl(page);
    expect(text).not.toContain("Empowering People.");
    expect(text).not.toContain("Key Features");
  });

  test("switching back to English restores the whole interface", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForAppReady(page);

    const group = page.getByRole("group", { name: "Interface language" });
    await group.getByRole("button", { name: /हिन्दी/ }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");

    await page
      .getByRole("group", { name: "इंटरफ़ेस भाषा" })
      .getByRole("button", { name: /English/ })
      .click();

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Empowering People."
    );

    const text = await bodyTextWithoutLanguageControl(page);
    expect(DEVANAGARI.test(text)).toBe(false);
  });

  test("the choice persists across a reload", async ({ page }) => {
    await page.goto("/");
    await waitForAppReady(page);

    await page
      .getByRole("group", { name: "Interface language" })
      .getByRole("button", { name: /हिन्दी/ })
      .click();
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");

    await page.reload();
    await waitForAppReady(page);

    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "लोगों को सशक्त बनाना।"
    );
  });

  test("a fresh visitor with no stored preference gets English", async ({
    page,
  }) => {
    // No prior interaction: default must not be inferred from locale or region.
    await page.goto("/");
    await waitForAppReady(page);

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    const stored = await page.evaluate(() =>
      window.localStorage.getItem("surang-saathi.locale")
    );
    expect(stored).toBeNull();
  });

  test("never renders the same label in both languages at once", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForAppReady(page);

    const text = await bodyTextWithoutLanguageControl(page);
    // The old bilingual pattern ("Hazards / खतरे") is forbidden outright.
    expect(text).not.toMatch(/[A-Za-z]\s*\/\s*[ऀ-ॿ]/);
    expect(text).not.toMatch(/[ऀ-ॿ]\s*\/\s*[A-Za-z]/);
  });

  test("the language control is keyboard operable", async ({ page }) => {
    await page.goto("/");
    await waitForAppReady(page);

    const hindi = page
      .getByRole("group", { name: "Interface language" })
      .getByRole("button", { name: /हिन्दी/ });

    await hindi.focus();
    await expect(hindi).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  });

  test("Hindi mode has no horizontal overflow at 360px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto("/");
    await waitForAppReady(page);

    await page
      .getByRole("group", { name: "Interface language" })
      .getByRole("button", { name: /हिन्दी/ })
      .click();
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
    await waitForStyles(page);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });
});
