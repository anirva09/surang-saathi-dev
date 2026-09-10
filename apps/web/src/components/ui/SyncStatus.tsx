import React from "react";
import { Cloud, CloudOff, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/cn";

export type SyncState = "QUEUED" | "SYNCING" | "SYNCED" | "CONFLICT" | "OFFLINE";

export interface SyncStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  state: SyncState;
  /**
   * Overrides the built-in English wording. Localized screens pass a
   * translated string; the design-system reference page relies on the default.
   */
  label?: string;
}

export function SyncStatus({ state, label, className, ...props }: SyncStatusProps) {
  const configs: Record<SyncState, { label: string; icon: any; colorClass: string }> = {
    QUEUED: { label: "Queued for sync", icon: Cloud, colorClass: "text-warningInk" },
    SYNCING: { label: "Syncing...", icon: RefreshCw, colorClass: "text-primary animate-spin" },
    SYNCED: { label: "Synced", icon: CheckCircle2, colorClass: "text-success" },
    CONFLICT: { label: "Sync Conflict", icon: AlertTriangle, colorClass: "text-dangerInk" },
    OFFLINE: { label: "Offline Mode", icon: CloudOff, colorClass: "text-text/80" }, // Calm neutral
  };

  const config = configs[state];
  const Icon = config.icon;

  if (!config) {
    throw new Error(`Invalid SyncState: ${state}`);
  }

  return (
    <div
      className={cn("inline-flex items-center gap-1.5 text-[12px] font-medium", config.colorClass, className)}
      {...props}
    >
      <Icon className="w-4 h-4" aria-hidden="true" />
      <span>{label ?? config.label}</span>
    </div>
  );
}


