import React from "react";
import { cn } from "@/utils/cn";
import { MapPin, CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";

export type GeofenceState = "LOCAL_VALID" | "SERVER_PENDING" | "SERVER_VERIFIED" | "OUTSIDE_GEOFENCE" | "CONFLICT";

export interface GeofenceProofProps extends React.HTMLAttributes<HTMLDivElement> {
  state: GeofenceState;
  /**
   * Overrides the built-in English wording. Localized screens pass a
   * translated string; the design-system reference page relies on the default.
   */
  label?: string;
}

export function GeofenceProof({ state, label, className, ...props }: GeofenceProofProps) {
  const configs: Record<GeofenceState, { label: string; icon: any; colorClass: string }> = {
    LOCAL_VALID: { label: "Device verified", icon: MapPin, colorClass: "text-text" },
    SERVER_PENDING: { label: "Verifying with server...", icon: Clock, colorClass: "text-warningInk" },
    SERVER_VERIFIED: { label: "Server verified", icon: CheckCircle, colorClass: "text-success" },
    OUTSIDE_GEOFENCE: { label: "Outside geofence", icon: XCircle, colorClass: "text-dangerInk" },
    CONFLICT: { label: "Location conflict", icon: AlertTriangle, colorClass: "text-dangerInk" },
  };

  const config = configs[state];
  const Icon = config.icon;

  if (!config) {
    throw new Error(`Invalid GeofenceState: ${state}`);
  }

  return (
    <div
      className={cn("inline-flex items-center gap-1.5 text-[12px] font-medium px-2 py-1 bg-surface border border-border rounded-[2px]", config.colorClass, className)}
      {...props}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      <span>{label ?? config.label}</span>
    </div>
  );
}


