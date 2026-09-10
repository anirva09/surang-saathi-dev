import { expect, type Page } from "@playwright/test";

/**
 * Readiness gates for layout-sensitive assertions.
 *
 * `page.goto` resolves on `load`, but in `next dev` the stylesheet is injected
 * by the client bundle and React hydrates afterwards. Playwright's web-first
 * assertions retry, but `boundingBox()` and `click()` do not wait for either of
 * those, so a slower machine measures an unstyled element (a hero CTA reads
 * 17px instead of 48px) or clicks a button before its handler is attached.
 *
 * These helpers poll for observable proof that each stage finished. They are
 * not timing hacks: each one asserts a specific condition that is false before
 * the stage completes and true after, so a genuinely broken page still fails.
 */

/**
 * Resolves once the stylesheet has applied.
 *
 * `globals.css` paints `body` with the background token. Before CSS lands the
 * computed background is transparent, so this flips exactly when styles apply.
 */
export async function waitForStyles(page: Page) {
  await expect
    .poll(
      () =>
        page.evaluate(() => getComputedStyle(document.body).backgroundColor),
      { message: "stylesheet never applied to <body>" }
    )
    .toBe("rgb(247, 243, 234)");
}

/**
 * Resolves once React has hydrated the masthead.
 *
 * `AccessibilityControls` sets an inline font-size on <html> from a client
 * effect. The attribute is absent in server-rendered HTML and present only
 * after hydration runs, which makes it a precise hydration marker — and it
 * proves the very control the text-size test then exercises is live.
 */
export async function waitForHydration(page: Page) {
  await expect
    .poll(
      () => page.evaluate(() => document.documentElement.style.fontSize),
      { message: "masthead never hydrated (no inline root font-size)" }
    )
    .not.toBe("");
}

/** Styles applied and the page hydrated — the default gate for `/`. */
export async function waitForAppReady(page: Page) {
  await waitForStyles(page);
  await waitForHydration(page);
}
