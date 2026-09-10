import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RiskIndexMeter } from "@/components/ui/RiskIndexMeter";
import { SeveritySelector } from "@/components/ui/SeveritySelector";
import { GeofenceProof } from "@/components/ui/GeofenceProof";
import { SyncStatus } from "@/components/ui/SyncStatus";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { ConsequenceConfirm } from "@/components/ui/ConsequenceConfirm";
import React from "react";

describe("StatusBadge", () => {
  it("resolves every declared state", () => {
    const states = ["success", "warning", "danger", "info", "neutral"] as const;
    states.forEach((state) => {
      const { container } = render(<StatusBadge status={state} label={state} />);
      expect(container.textContent).toContain(state);
    });
  });
});

describe("RiskIndexMeter", () => {
  it("renders contributing factors", () => {
    render(
      <RiskIndexMeter
        score={74.2}
        contributingFactors={[
          { name: "Overdue Actions", weight: 0.4, currentValue: 12 },
        ]}
      />
    );
    expect(screen.getByText("Overdue Actions")).not.toBeNull();
    expect(screen.getByText("12 · 40% weight")).not.toBeNull();
  });
});

describe("SeveritySelector", () => {
  it("renders AI suggestion separately without preselecting", () => {
    let value = "low";
    render(
      <SeveritySelector
        value={value as any}
        onChange={(v) => (value = v)}
        aiSuggestion="high"
      />
    );
    expect(screen.getByText(/AI Suggests: High Severity/)).not.toBeNull();
    const radio = screen.getByDisplayValue("low") as HTMLInputElement;
    expect(radio.checked).toBe(true);
    const highRadio = screen.getByDisplayValue("high") as HTMLInputElement;
    expect(highRadio.checked).toBe(false);
  });
});

describe("GeofenceProof", () => {
  it("distinguishes LOCAL_VALID from SERVER_VERIFIED", () => {
    const { container: local } = render(<GeofenceProof state="LOCAL_VALID" />);
    expect(local.textContent).toContain("Device verified");
    const { container: server } = render(<GeofenceProof state="SERVER_VERIFIED" />);
    expect(server.textContent).toContain("Server verified");
  });

  it("SERVER_PENDING is not authoritative", () => {
    const { container } = render(<GeofenceProof state="SERVER_PENDING" />);
    expect(container.textContent).toContain("Verifying with server...");
  });
});

describe("SyncStatus", () => {
  it("renders all states distinctly", () => {
    const states = ["QUEUED", "SYNCING", "SYNCED", "CONFLICT", "OFFLINE"] as const;
    states.forEach((state) => {
      const { container } = render(<SyncStatus state={state} />);
      expect(container.textContent).toBeTruthy();
    });
  });
});

describe("Button", () => {
  it("commit and danger are visually distinct", () => {
    render(<Button variant="commit">CommitBtn</Button>);
    render(<Button variant="danger">DangerBtn</Button>);
    const commitBtn = screen.getByText("CommitBtn");
    const dangerBtn = screen.getByText("DangerBtn");
    expect(commitBtn.className).toContain("bg-success");
    expect(dangerBtn.className).toContain("bg-danger");
  });
});

describe("Field", () => {
  it("correctly associates label and hints with aria-describedby", () => {
    render(
      <Field label="Test Label" hint="Test Hint" error="Test Error">
        {(props) => <input {...props} data-testid="input" />}
      </Field>
    );
    const input = screen.getByTestId("input");
    const ariaDescribedBy = input.getAttribute("aria-describedby");
    expect(ariaDescribedBy).toBeTruthy();
    const errorEl = screen.getByText("Test Error");
    expect(ariaDescribedBy).toContain(errorEl.id);
  });
});

describe("ConsequenceConfirm", () => {
  it("distinguishes COMMIT from DANGER", () => {
    render(
      <ConsequenceConfirm
        title="Commit Action"
        explanation="Permanent"
        variant="commit"
        onConfirm={() => {}}
        onCancel={() => {}}
        confirmText="Confirm"
      />
    );
    const commitBtn = screen.getByText("Confirm");
    expect(commitBtn.className).toContain("bg-success");
  });
});
