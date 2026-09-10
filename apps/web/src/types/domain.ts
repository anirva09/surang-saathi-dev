/**
 * Canonical domain unions for Surang Saathi.
 *
 * Defined once here so the same string literals are not re-declared across
 * components and demo adapters (see docs/DECISIONS.md ADR-011/ADR-012 and the
 * locked component semantics in the master prompt).
 *
 * SyncState and GeofenceState already have a single home on the components
 * that own their presentation; they are re-exported here so consumers have one
 * import site for domain vocabulary.
 */

export type { SyncState } from "@/components/ui/SyncStatus";
export type { GeofenceState } from "@/components/ui/GeofenceProof";

export type HazardSeverity = "LOW" | "MEDIUM" | "HIGH";

export type LifecycleStatus =
  | "OPEN"
  | "ACKNOWLEDGED"
  | "OVERDUE"
  | "ESCALATED"
  | "RESOLVED";
