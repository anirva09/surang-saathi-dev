"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { ChoiceRow } from "@/components/ui/ChoiceRow";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SyncStatus } from "@/components/ui/SyncStatus";
import { GeofenceProof } from "@/components/ui/GeofenceProof";
import {
  SeveritySelector,
  SeverityLevel,
} from "@/components/ui/SeveritySelector";
import { RiskIndexMeter } from "@/components/ui/RiskIndexMeter";
import { InspectionCard } from "@/components/domain/InspectionCard";

export default function DesignSystemPage() {
  const [severity, setSeverity] = useState<SeverityLevel>("low");

  return (
    <main className="p-4 md:p-8 max-w-5xl mx-auto flex flex-col gap-12 bg-background min-h-screen">
      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-text">
          Surang Saathi Design System
        </h1>

        <p className="text-text/80 mt-1">
          Foundation components and tokens for field and manager portals.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-text border-b border-border/50 pb-2">
          1. Foundations & Tokens
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              name: "Background",
              color: "bg-background",
              text: "text-text",
            },
            {
              name: "Surface",
              color: "bg-surface",
              text: "text-text",
            },
            {
              name: "Primary",
              color: "bg-primary",
              text: "text-surface",
            },
            {
              name: "Accent",
              color: "bg-accent",
              text: "text-text",
            },
            {
              name: "Success",
              color: "bg-success",
              text: "text-surface",
            },
            {
              name: "Danger",
              color: "bg-danger",
              text: "text-surface",
            },
            {
              name: "Text",
              color: "bg-text",
              text: "text-surface",
            },
            {
              name: "Border",
              color: "bg-border",
              text: "text-text",
            },
          ].map((token) => (
            <div key={token.name} className="flex flex-col gap-2">
              <div
                className={`h-16 rounded-[2px] border border-border/50 ${token.color} ${token.text} flex items-center justify-center font-medium text-xs`}
              >
                {token.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-text border-b border-border/50 pb-2">
          2. Buttons
        </h2>

        <div className="flex flex-wrap items-end gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-text/80 uppercase">
              lg (48px, primary)
            </span>

            <Button size="lg" variant="primary">
              Submit Inspection
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-text/80 uppercase">
              md (40px, default)
            </span>

            <Button size="md" variant="secondary">
              Export Register
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-text/80 uppercase">
              sm (32px, dense)
            </span>

            <Button size="sm" variant="ghost">
              Save Draft
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-text/80 uppercase">Commit</span>

            <Button size="md" variant="commit">
              Approve Sign-off
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-text/80 uppercase">Danger</span>

            <Button size="md" variant="danger">
              Discard Record
            </Button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-text border-b border-border/50 pb-2">
          3. Form Fields & Choice Rows
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Field
            label="Hazard Description"
            coLabel="खतरे का विवरण"
            required
            hint="Describe the hazard clearly or use the voice note feature."
          >
            {(props) => (
              <textarea
                {...props}
                className="min-h-[80px] p-3 text-[14px] bg-surface border border-border rounded-[2px] focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter details..."
              />
            )}
          </Field>

          <Field
            label="Equipment ID"
            error="This ID format is invalid for the selected mine."
          >
            {(props) => (
              <input
                {...props}
                type="text"
                className="h-12 px-3 text-[14px] bg-surface border border-danger rounded-[2px] focus:outline-none focus:ring-2 focus:ring-danger"
                defaultValue="EXC-99-INVALID"
              />
            )}
          </Field>

          <div className="flex flex-col gap-3 col-span-1 md:col-span-2">
            <h3 className="text-sm font-medium text-text">
              Mobile Hit Target Controls (≥48px)
            </h3>

            <div
              data-testid="worker-touch-targets"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <ChoiceRow
                name="status"
                value="safe"
                label="Safe to proceed"
                coLabel="आगे बढ़ने के लिए सुरक्षित"
                checked={true}
                onChange={() => {}}
              />

              <ChoiceRow
                name="status"
                value="unsafe"
                label="Unsafe conditions detected"
                coLabel="असुरक्षित स्थितियां"
                checked={false}
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-text border-b border-border/50 pb-2">
          4. Status, Sync & Evidence
        </h2>

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-text w-32">
              Sync State:
            </span>

            <SyncStatus state="QUEUED" />
            <SyncStatus state="SYNCING" />
            <SyncStatus state="SYNCED" />
            <SyncStatus state="CONFLICT" />
            <SyncStatus state="OFFLINE" />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-text w-32">
              Geofence:
            </span>

            <GeofenceProof state="LOCAL_VALID" />
            <GeofenceProof state="SERVER_PENDING" />
            <GeofenceProof state="SERVER_VERIFIED" />
            <GeofenceProof state="OUTSIDE_GEOFENCE" />
            <GeofenceProof state="CONFLICT" />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-text w-32">
              Lifecycle:
            </span>

            <StatusBadge status="info" label="Open" />
            <StatusBadge status="neutral" label="Acknowledged" />
            <StatusBadge status="warning" label="Overdue" />
            <StatusBadge status="danger" label="Escalated" />
            <StatusBadge status="success" label="Resolved" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-text border-b border-border/50 pb-2">
          5. AI Accountability & Risk
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface p-4 border border-border rounded-[2px]">
            <SeveritySelector
              value={severity}
              onChange={setSeverity}
              aiSuggestion="high"
            />
          </div>

          <RiskIndexMeter
            score={74.2}
            contributingFactors={[
              {
                name: "Overdue Corrective Actions",
                weight: 0.4,
                currentValue: 12,
              },
              {
                name: "Gas Threshold Breaches (30d)",
                weight: 0.35,
                currentValue: 4,
              },
              {
                name: "Inspection Coverage vs Target",
                weight: 0.25,
                currentValue: "82%",
              },
            ]}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-text border-b border-border/50 pb-2">
          6. Domain Evidence Cards
        </h2>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-text">
              Mobile Worker View
            </h3>

            <div className="max-w-md">
              <InspectionCard
                id="INSP-2026-901"
                type="Daily Safety Walk"
                status="RESOLVED"
                syncState="SYNCED"
                geofenceState="SERVER_VERIFIED"
                actorName="Rajesh Kumar (Sirdar)"
                timestamp="09 Sep 2026, 06:15 AM"
                evidenceCount={4}
                locationName="Seam 3, Panel B"
                isDesktopDense={false}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-text">
              Desktop Manager Dense View
            </h3>

            <InspectionCard
              id="HZRD-2026-442"
              type="Roof support damage observed"
              status="ESCALATED"
              syncState="CONFLICT"
              geofenceState="CONFLICT"
              actorName="M. Sharma"
              timestamp="08 Sep 2026, 14:30 PM"
              evidenceCount={1}
              locationName="Seam 2, Main Gallery"
              isDesktopDense={true}
            />
          </div>
        </div>
      </section>
    </main>
  );
}