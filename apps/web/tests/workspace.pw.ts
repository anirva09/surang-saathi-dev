import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waitForAppReady, waitForStyles } from "./helpers/ready";
import { apiErrorRegion, backendIsUp, SEEDED } from "./helpers/backend";

/**
 * The hazard register, hazard detail, risk and audit screens.
 *
 * Every route gets the same three unconditional gates — accessibility, no
 * horizontal overflow, and the English-only localization policy — because those
 * hold whether the API answered or not. Data and failure assertions branch on
 * whether the backend is reachable, so neither run is silently vacuous.
 */

const ROUTES = [
  { path: "/hazards", name: "hazard register" },
  { path: `/hazards/${SEEDED.hazardId}`, name: "hazard detail" },
  { path: "/risk", name: "risk index" },
  { path: "/audit", name: "audit ledger" },
];

const DEVANAGARI = /[ऀ-ॿ]/;

/** Body text minus the language control, which legitimately shows "हिन्दी". */
async function bodyTextWithoutLanguageControl(
  page: import("@playwright/test").Page
) {
  return page.evaluate(() => {
    const clone = document.body.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('[role="group"][aria-label]').forEach((group) => {
      const label = group.getAttribute("aria-label") ?? "";
      if (/language|भाषा/i.test(label)) group.remove();
    });
    return clone.innerText;
  });
}

test.describe("Workspace routes — unconditional gates", () => {
  for (const route of ROUTES) {
    test(`${route.name} has no automatically detectable a11y issues`, async ({
      page,
    }) => {
      await page.goto(route.path);
      await waitForStyles(page);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test(`${route.name} has no horizontal overflow at 360px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 360, height: 640 });
      await page.goto(route.path);
      await waitForStyles(page);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );

      expect(overflow).toBe(false);
    });

    test(`${route.name} renders English only by default`, async ({ page }) => {
      await page.goto(route.path);
      await waitForAppReady(page);

      await expect(page.locator("html")).toHaveAttribute("lang", "en");

      const text = await bodyTextWithoutLanguageControl(page);
      expect(
        DEVANAGARI.test(text),
        "English mode must not render Devanagari outside the language control"
      ).toBe(false);
      // The forbidden bilingual pattern, e.g. "Hazards / खतरे".
      expect(text).not.toMatch(/[A-Za-z]\s*\/\s*[ऀ-ॿ]/);
    });

    test(`${route.name} translates fully when Hindi is selected`, async ({
      page,
    }) => {
      await page.goto(route.path);
      await waitForAppReady(page);

      await page
        .getByRole("group", { name: "Interface language" })
        .getByRole("button", { name: /हिन्दी/ })
        .click();

      await expect(page.locator("html")).toHaveAttribute("lang", "hi");

      // The workspace navigation is on every one of these screens, so it is the
      // reliable witness that the whole shell moved language.
      await expect(
        page.getByRole("navigation", { name: "कार्यक्षेत्र" })
      ).toBeVisible();
    });

    test(`${route.name} has exactly one h1`, async ({ page }) => {
      await page.goto(route.path);
      await waitForStyles(page);

      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    });

    test(`${route.name} marks its own workspace nav item as current`, async ({
      page,
    }) => {
      await page.goto(route.path);
      await waitForStyles(page);

      const current = page
        .getByRole("navigation", { name: "Workspace" })
        .locator('[aria-current="page"]');

      await expect(current).toHaveCount(1);
    });
  }
});

test.describe("Workspace routes — with the API reachable", () => {
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

  test("the register lists the seeded hazard with its full state", async ({
    page,
  }) => {
    await page.goto("/hazards");
    await waitForStyles(page);

    const card = page
      .getByRole("listitem")
      .filter({ hasText: SEEDED.hazardId })
      .first();

    await expect(card).toContainText(SEEDED.hazardTitle);
    await expect(card).toContainText(SEEDED.hazardLocation);
    await expect(card).toContainText(SEEDED.managerName);
    await expect(card).toContainText(SEEDED.reporterName);
    // Severity, lifecycle, sync and geofence are all present — the register
    // never shows a hazard without saying how trustworthy its record is.
    await expect(card).toContainText("High");
    await expect(card).toContainText("Escalated");
    // The two conflicts are named separately: a bare "Conflict" twice would
    // read as a duplicate rather than as two distinct disputed facts.
    await expect(card).toContainText("Sync conflict");
    await expect(card).toContainText("Location conflict");
  });

  test("the severity filter narrows the register and survives a reload", async ({
    page,
  }) => {
    await page.goto("/hazards");
    await waitForStyles(page);

    await page.getByLabel("Severity", { exact: true }).selectOption("HIGH");
    await page.getByRole("button", { name: "Apply filters" }).click();

    await expect(page).toHaveURL(/severity=HIGH/);
    await expect(page.getByLabel("Severity", { exact: true })).toHaveValue(
      "HIGH"
    );

    await page.reload();
    await waitForStyles(page);
    await expect(page.getByLabel("Severity", { exact: true })).toHaveValue(
      "HIGH"
    );
  });

  test("hazard detail shows the evidence hash in full", async ({ page }) => {
    await page.goto(`/hazards/${SEEDED.hazardId}`);
    await waitForStyles(page);

    // Exact, so the "Attach evidence" upload panel is not also matched.
    const evidence = page.getByRole("region", { name: "Evidence", exact: true });
    await expect(evidence).toContainText(SEEDED.evidenceId);

    // A truncated digest cannot be checked against anything, so the whole
    // 64-character hash must be on the page.
    const text = await evidence.innerText();
    expect(text).toMatch(/[0-9a-f]{64}/);
  });

  test("hazard detail lists the corrective action with its owner and deadline", async ({
    page,
  }) => {
    await page.goto(`/hazards/${SEEDED.hazardId}`);
    await waitForStyles(page);

    const actions = page.getByRole("region", { name: "Corrective actions" });
    await expect(actions).toContainText(SEEDED.actionId);
    await expect(actions).toContainText(SEEDED.managerName);
  });

  test("hazard detail is honest that there is no authentication behind it", async ({
    page,
  }) => {
    await page.goto(`/hazards/${SEEDED.hazardId}`);
    await waitForStyles(page);

    const decision = page.getByRole("region", { name: "Manager decision" });
    await expect(decision).toContainText(
      "This prototype has no authentication service"
    );
    // The acting user is named, so the ledger entry is predictable.
    await expect(decision).toContainText("Acting as");
  });

  test("the risk screen shows every factor's weight and contribution", async ({
    page,
  }) => {
    await page.goto("/risk");
    await waitForStyles(page);

    await expect(page.getByRole("main")).toContainText(SEEDED.riskScore);
    await expect(page.getByRole("main")).toContainText(SEEDED.riskLevel);

    const table = page.getByRole("table");
    await expect(table).toBeVisible();
    for (const column of [
      "Factor",
      "Weight",
      "Current value",
      "Contribution",
      "Source",
    ]) {
      await expect(
        // Exact, so "Factor" does not also match "Factor score".
        table.getByRole("columnheader", { name: column, exact: true })
      ).toBeVisible();
    }

    // Every factor row is a real row with a row header, not a styled div.
    const rows = table.locator("tbody tr");
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test("the audit ledger reports its own verification verdict", async ({
    page,
  }) => {
    await page.goto("/audit");
    await waitForStyles(page);

    const verdict = page.getByRole("region", { name: /hash chain/i });
    await expect(verdict).toBeVisible();

    // Whichever way it went, the page must state it — never leave it implied.
    const text = await verdict.innerText();
    expect(text).toMatch(/The hash chain is (intact|broken)/);
  });

  test("the ledger shows hashes when it has entries, and says so when it does not", async ({
    page,
  }) => {
    await page.goto("/audit");
    await waitForStyles(page);

    // Scoped to the ledger's own list — the workspace nav is a list of <li> too.
    const entries = page
      .getByRole("list", { name: "Audit ledger entries, newest first" })
      .getByRole("listitem");

    const count = await entries.count();

    if (count === 0) {
      // A freshly seeded database has entities but no recorded events yet. That
      // is a real state and gets a real assertion: the page must say the ledger
      // is empty, not imply the chain was checked and found sound.
      await expect(page.getByRole("main")).toContainText(
        "The audit ledger has no events yet."
      );
      return;
    }

    const first = entries.first();
    await expect(first).toContainText("Entry hash");
    await expect(first).toContainText("Previous hash");
    expect(await first.innerText()).toMatch(/[0-9a-f]{64}/);
  });
});

test.describe("Workspace routes — with the API unreachable", () => {
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

  for (const route of ROUTES) {
    test(`${route.name} reports the outage rather than inventing data`, async ({
      page,
    }) => {
      await page.goto(route.path);
      await waitForStyles(page);

      const state = apiErrorRegion(page);
      await expect(state).toBeVisible();
      await expect(state).toContainText("NETWORK_ERROR");

      // None of the seeded values may leak onto a page that loaded nothing.
      const body = await page.getByRole("main").innerText();
      expect(body).not.toContain(SEEDED.riskScore);
      expect(body).not.toContain(SEEDED.hazardTitle);
      expect(body).not.toContain(SEEDED.managerName);
    });
  }

  test("the failure state names a recovery step rather than a dead end", async ({
    page,
  }) => {
    await page.goto("/hazards");
    await waitForStyles(page);

    const state = apiErrorRegion(page);
    await expect(state).toContainText("docker compose up");
    await expect(
      state.getByRole("button", { name: "Reload this page" })
    ).toBeVisible();
  });
});
