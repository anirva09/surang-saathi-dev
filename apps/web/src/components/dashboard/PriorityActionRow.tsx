import React from "react";
import { Camera, Clock3, UserRound } from "lucide-react";
import { cn } from "@/utils/cn";
import { StatusBadge, type SemanticStatus } from "@/components/ui/StatusBadge";
import { SyncStatus } from "@/components/ui/SyncStatus";
import { GeofenceProof } from "@/components/ui/GeofenceProof";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { PriorityAction } from "@/data/demo/dashboard";

const ENTITY_LABEL: Record<PriorityAction["entityType"], string> = {
  HAZARD: "Hazard",
  INSPECTION: "Inspection",
  CORRECTIVE_ACTION: "Corrective action",
};

const SEVERITY: Record<
  NonNullable<PriorityAction["severity"]>,
  { label: string; semantic: SemanticStatus }
> = {
  HIGH: { label: "High severity", semantic: "danger" },
  MEDIUM: { label: "Medium severity", semantic: "warning" },
  LOW: { label: "Low severity", semantic: "neutral" },
};

const LIFECYCLE: Record<
  PriorityAction["lifecycleStatus"],
  { label: string; semantic: SemanticStatus }
> = {
  OPEN: { label: "Open", semantic: "info" },
  ACKNOWLEDGED: { label: "Acknowledged", semantic: "neutral" },
  OVERDUE: { label: "Overdue", semantic: "warning" },
  ESCALATED: { label: "Escalated", semantic: "danger" },
  RESOLVED: { label: "Resolved", semantic: "success" },
  PENDING_REVIEW: { label: "Pending review", semantic: "info" },
};

export function PriorityActionRow({ item }: { item: PriorityAction }) {
  const severity = item.severity ? SEVERITY[item.severity] : null;
  const lifecycle = LIFECYCLE[item.lifecycleStatus];
  const unassigned = item.owner.toLowerCase() === "unassigned";

  return (
    <li
      className={cn(
        "flex flex-col gap-3 p-4 bg-surface border border-border border-l-4 rounded-[2px] min-w-0",
        // The left rule ranks the row at a glance without flooding the card.
        item.severity === "HIGH" || item.lifecycleStatus === "ESCALATED"
          ? "border-l-danger"
          : item.overdue
            ? "border-l-accent"
            : "border-l-border"
      )}
    >
      {/* Identity */}
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 min-w-0">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.6875rem] font-medium uppercase tracking-wider text-text/80">
            <span>{ENTITY_LABEL[item.entityType]}</span>
            <span aria-hidden="true">·</span>
            <span className="font-bold text-text tracking-normal">
              {item.id}
            </span>
          </p>
          <h3 className="mt-1 text-[1rem] font-bold leading-tight text-text break-words">
            {item.title}
          </h3>
          <p className="mt-1 text-[0.8125rem] text-text/80 break-words">
            {item.location}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {severity && (
            <StatusBadge
              status={severity.semantic}
              label={severity.label}
            />
          )}
          <StatusBadge status={lifecycle.semantic} label={lifecycle.label} />
        </div>
      </div>

      {/* Accountability — owner and deadline are never hidden behind a detail page */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.8125rem]">
        <span className="inline-flex items-center gap-1.5 min-w-0">
          <UserRound
            className="w-3.5 h-3.5 shrink-0 text-text/60"
            aria-hidden="true"
          />
          <span className="text-text/80">Owner:</span>
          <span
            className={cn(
              "font-medium break-words",
              unassigned ? "text-dangerInk font-bold" : "text-text"
            )}
          >
            {item.owner}
          </span>
        </span>

        <span className="inline-flex items-center gap-1.5">
          <Clock3
            className={cn(
              "w-3.5 h-3.5 shrink-0",
              item.overdue ? "text-dangerInk" : "text-text/60"
            )}
            aria-hidden="true"
          />
          <span
            className={cn(
              "font-medium",
              item.overdue ? "text-dangerInk" : "text-text"
            )}
          >
            {item.dueLabel}
          </span>
          {item.dueDate && (
            <span className="text-text/80">({item.dueDate})</span>
          )}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <Camera
            className="w-3.5 h-3.5 shrink-0 text-text/60"
            aria-hidden="true"
          />
          <span className="text-text">
            {item.evidenceCount}{" "}
            {item.evidenceCount === 1 ? "evidence file" : "evidence files"}
          </span>
        </span>
      </div>

      {/* Evidence integrity + the action. Chips wrap; they never force width. */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 min-w-0">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <GeofenceProof state={item.geofenceState} />
          <SyncStatus state={item.syncState} />
        </div>

        <ButtonLink
          href={item.href}
          variant={
            item.severity === "HIGH" || item.overdue ? "primary" : "secondary"
          }
          size="md"
          className="shrink-0"
        >
          {item.actionLabel}
          <span className="sr-only"> {item.id}</span>
        </ButtonLink>
      </div>
    </li>
  );
}
