import { test, expect } from "@playwright/test";
import { waitForStyles } from "./helpers/ready";
import { backendIsUp, SEEDED } from "./helpers/backend";

/**
 * The Golden Workflow, end to end, through the real UI against the real backend.
 *
 * This is the test that proves the integration rather than the wiring: a manager
 * raises a corrective action in the browser, the backend records it, the
 * append-only ledger grows by exactly that event, the new entry carries a hash
 * that chains to its predecessor, and the chain still verifies.
 *
 * It is deliberately additive — raising an action does not change the hazard's
 * severity or status — so it can run alongside the register assertions without
 * either invalidating the other.
 *
 * Requires a reachable API with the seeded mine. Skipped, with a stated reason,
 * when there is none: a workflow test that passes without a backend would be
 * proving nothing.
 */

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";

interface LedgerState {
  total: number;
  newest: {
    eventType: string;
    entityType: string;
    entityId: string;
    actorId: string | null;
    eventHash: string;
    previousHash: string | null;
    sequence: number;
  } | null;
}

/** Reads the ledger straight from the API, independently of the UI. */
async function readLedger(): Promise<LedgerState> {
  const response = await fetch(`${API_BASE_URL}/api/v1/audit/events?limit=1`);
  expect(response.ok, "the audit endpoint must answer").toBe(true);
  const body = await response.json();
  return { total: body.total, newest: body.items[0] ?? null };
}

async function readVerification() {
  const response = await fetch(`${API_BASE_URL}/api/v1/audit/verify`);
  expect(response.ok, "the verify endpoint must answer").toBe(true);
  return response.json();
}

test.describe("Golden Workflow — browser to ledger", () => {
  let apiUp = false;
  test.beforeAll(async () => {
    apiUp = await backendIsUp();
  });
  test.beforeEach(() => {
    test.skip(
      !apiUp,
      "The Surang Saathi API is not reachable, so the Golden Workflow cannot be exercised."
    );
  });

  test("raising a corrective action in the UI appends one verifiable ledger entry", async ({
    page,
  }) => {
    const before = await readLedger();

    await page.goto(`/hazards/${SEEDED.hazardId}`);
    await waitForStyles(page);

    // The hazard the whole demonstration turns on is really on screen.
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      SEEDED.hazardTitle
    );

    const panel = page.getByRole("region", {
      name: "Raise a corrective action",
    });
    await expect(panel).toBeVisible();

    const description = `Secondary roof-support inspection — raised by the end-to-end test at ${new Date().toISOString()}`;

    await panel.getByLabel("What must be done").fill(description);
    await panel
      .getByLabel("Assign to (user ID)")
      // A real seeded user: the backend 404s on an unknown assignee, which is
      // exactly the behaviour this test relies on being correct.
      .fill("USR-MSHARMA");

    // Comfortably in the future, so the action is not created already overdue.
    const due = new Date(Date.now() + 7 * 86_400_000);
    const pad = (value: number) => String(value).padStart(2, "0");
    await panel
      .getByLabel("Deadline")
      .fill(
        `${due.getFullYear()}-${pad(due.getMonth() + 1)}-${pad(
          due.getDate()
        )}T09:00`
      );

    await panel.getByRole("button", { name: "Raise action" }).click();

    // The UI confirms in its own live region rather than leaving the user guessing.
    await expect(panel.getByText("Recorded.")).toBeVisible({ timeout: 20_000 });

    // ── The backend's own account of what happened ──────────────────────

    const after = await readLedger();
    expect(
      after.total,
      "raising one action must append exactly one ledger entry"
    ).toBe(before.total + 1);

    const newest = after.newest;
    expect(newest).not.toBeNull();
    expect(newest!.eventType).toBe("CORRECTIVE_ACTION_CREATED");
    expect(newest!.entityType).toBe("CORRECTIVE_ACTION");
    // The acting user is recorded honestly — not anonymous, not fabricated.
    expect(newest!.actorId).toBe("USR-MSHARMA");

    // The entry is hash-chained: its own digest, and a link to what came before.
    expect(newest!.eventHash).toMatch(/^[0-9a-f]{64}$/);
    if (before.total > 0) {
      expect(
        newest!.previousHash,
        "a non-genesis entry must name its predecessor"
      ).toMatch(/^[0-9a-f]{64}$/);
    }

    // And the chain as a whole still checks out.
    const verification = await readVerification();
    expect(verification.valid, verification.reason ?? "chain must verify").toBe(
      true
    );
    expect(verification.checkedEvents).toBe(after.total);

    // ── And the UI tells the same story ─────────────────────────────────

    await page.goto(`/hazards/${SEEDED.hazardId}`);
    await waitForStyles(page);
    await expect(
      page.getByRole("region", { name: "Corrective actions" })
    ).toContainText(description);

    await page.goto("/audit");
    await waitForStyles(page);

    const verdict = page.getByRole("region", { name: /hash chain/i });
    await expect(verdict).toContainText("The hash chain is intact");

    const entries = page
      .getByRole("list", { name: "Audit ledger entries, newest first" })
      .getByRole("listitem");
    const first = entries.first();
    await expect(first).toContainText("CORRECTIVE_ACTION_CREATED");
    await expect(first).toContainText(newest!.eventHash);
  });

  test("the register and the dashboard agree with the API's own counts", async ({
    page,
  }) => {
    // The dashboard's KPIs and the register's total are computed by the backend.
    // If the UI disagrees with the API, one of them is lying to the manager.
    const summaryResponse = await fetch(
      `${API_BASE_URL}/api/v1/dashboard/summary?mineId=${SEEDED.mineId}`
    );
    const summary = await summaryResponse.json();

    await page.goto("/dashboard");
    await waitForStyles(page);

    const openTile = page
      .getByRole("listitem")
      .filter({ hasText: "Open hazards" })
      .first();
    await expect(openTile).toContainText(String(summary.kpis.openHazards));

    const conflictTile = page
      .getByRole("listitem")
      .filter({ hasText: "Evidence conflicts" })
      .first();
    await expect(conflictTile).toContainText(
      String(summary.kpis.conflictedHazards)
    );

    // And the risk panel shows the score the API computed, not a rounded guess.
    await expect(
      page.getByRole("region", { name: "Mine risk index" })
    ).toContainText(String(summary.risk.score));
  });

  test("a hazard that does not exist is reported as missing, not as an outage", async ({
    page,
  }) => {
    await page.goto("/hazards/HZRD-DOES-NOT-EXIST");
    await waitForStyles(page);

    // The distinction matters: "no such record" is the backend answering
    // correctly, and must not be dressed up as the API being down.
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toContainText("This record does not exist");

    const main = page.getByRole("main");
    await expect(main).toContainText("NOT_FOUND");
    await expect(main).toContainText("404");
    await expect(main).not.toContainText("could not be reached");
  });

  test("an unknown mine's risk is reported as missing rather than as zero", async ({
    page,
  }) => {
    // Proven through the API directly, because the UI is pinned to one mine:
    // the contract's 404 must not be turned into a zero score anywhere.
    const response = await fetch(
      `${API_BASE_URL}/api/v1/risk/mines/MINE-DOES-NOT-EXIST`
    );
    expect(response.status).toBe(404);

    const body = await response.json();
    // The stable envelope the client parses.
    expect(body.error.code).toBe("NOT_FOUND");
    expect(body.error.status).toBe(404);
    expect(typeof body.error.message).toBe("string");
  });
});
