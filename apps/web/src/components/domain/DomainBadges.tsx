"use client";

import React from "react";
import { ShieldAlert, ShieldCheck, Shield } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";
import type { MessageKey } from "@/i18n/messages.en";
import { StatusBadge, type SemanticStatus } from "@/components/ui/StatusBadge";
import { SyncStatus, type SyncState as SyncVisualState } from "@/components/ui/SyncStatus";
import {
  GeofenceProof,
  type GeofenceState as GeofenceVisualState,
} from "@/components/ui/GeofenceProof";
import {
  isGeofenceState,
  isLifecycleStatus,
  isSyncState,
  type HazardSeverity,
} from "@/lib/api/contract";

/**
 * The contract types hazard `severity`, `status`, `syncState` and
 * `geofenceState` as bare strings on the way out, so every badge here narrows
 * the value first and falls back to showing the raw code when the backend sends
 * something outside the documented vocabulary. Showing an unrecognised code is
 * the honest outcome — inventing a label for it is not.
 */

/** Translates a known enum member, or returns the raw code unchanged. */
function useEnumLabel() {
  const t = useT();
  return (prefix: string, value: string, known: boolean) =>
    known ? t(`${prefix}.${value}` as MessageKey) : value;
}

const SEVERITY_TONE: Record<HazardSeverity, SemanticStatus> = {
  LOW: "neutral",
  MEDIUM: "warning",
  HIGH: "danger",
};

const SEVERITY_ICON: Record<HazardSeverity, typeof Shield> = {
  LOW: ShieldCheck,
  MEDIUM: Shield,
  HIGH: ShieldAlert,
};

export function SeverityBadge({ severity }: { severity: string }) {
  const label = useEnumLabel();
  const known = severity in SEVERITY_TONE;
  const key = severity as HazardSeverity;

  return (
    <StatusBadge
      status={known ? SEVERITY_TONE[key] : "neutral"}
      icon={known ? SEVERITY_ICON[key] : Shield}
      label={label("domain.severity", severity, known)}
    />
  );
}

/**
 * Lifecycle status tones follow what the status means for safety, not a palette
 * rotation: resolved is settled, overdue and escalated demand attention.
 */
const STATUS_TONE: Record<string, SemanticStatus> = {
  OPEN: "info",
  ACKNOWLEDGED: "info",
  OVERDUE: "danger",
  ESCALATED: "danger",
  RESOLVED: "success",
};

export function LifecycleBadge({ status }: { status: string }) {
  const label = useEnumLabel();
  const known = isLifecycleStatus(status);

  return (
    <StatusBadge
      status={known ? STATUS_TONE[status] : "neutral"}
      label={label("domain.status", status, known)}
    />
  );
}

export function SyncBadge({ state }: { state: string }) {
  const label = useEnumLabel();
  const known = isSyncState(state);

  return (
    <SyncStatus
      // The visual component needs a member of its own union for icon and
      // colour; an unknown code borrows the neutral OFFLINE treatment while the
      // label still shows the real value.
      state={known ? (state as SyncVisualState) : "OFFLINE"}
      label={label("domain.sync", state, known)}
    />
  );
}

export function GeofenceBadge({ state }: { state: string }) {
  const label = useEnumLabel();
  const known = isGeofenceState(state);

  return (
    <GeofenceProof
      state={known ? (state as GeofenceVisualState) : "SERVER_PENDING"}
      label={label("domain.geofence", state, known)}
    />
  );
}
