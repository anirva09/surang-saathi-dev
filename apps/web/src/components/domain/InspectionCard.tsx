import React from "react";
import { cn } from "@/utils/cn";
import { StatusBadge, SemanticStatus } from "../ui/StatusBadge";
import { SyncStatus, SyncState } from "../ui/SyncStatus";
import { GeofenceProof, GeofenceState } from "../ui/GeofenceProof";
import { Camera, MapPin, User, Clock } from "lucide-react";

export interface InspectionCardProps {
  id: string;
  type: string;
  status:
    | "OPEN"
    | "ACKNOWLEDGED"
    | "OVERDUE"
    | "ESCALATED"
    | "RESOLVED";
  syncState: SyncState;
  geofenceState: GeofenceState;
  actorName: string;
  timestamp: string;
  evidenceCount: number;
  locationName: string;
  isDesktopDense?: boolean;
  className?: string;
}

export function InspectionCard({
  id,
  type,
  status,
  syncState,
  geofenceState,
  actorName,
  timestamp,
  evidenceCount,
  locationName,
  isDesktopDense = false,
  className,
}: InspectionCardProps) {
  const statusConfig: Record<
    string,
    { label: string; semantic: SemanticStatus }
  > = {
    OPEN: { label: "Open", semantic: "info" },
    ACKNOWLEDGED: { label: "Acknowledged", semantic: "neutral" },
    OVERDUE: { label: "Overdue", semantic: "warning" },
    ESCALATED: { label: "Escalated", semantic: "danger" },
    RESOLVED: { label: "Resolved", semantic: "success" },
  };

  const currentStatus = statusConfig[status] || statusConfig.OPEN;

  if (isDesktopDense) {
    // Desktop dense table-like row for manager views
    return (
      <div
        className={cn(
          "flex items-center gap-4 p-3 bg-surface border border-border rounded-[2px] hover:bg-black/5 transition-colors",
          className
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-text uppercase tracking-wider">
              {id}
            </span>

            <span className="text-[14px] font-bold text-text truncate">
              {type}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[12px] text-text/80 mt-1">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {actorName}
            </span>

            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {timestamp}
            </span>

            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {locationName}
            </span>
          </div>
        </div>

        {/* Responsive fix: badges may wrap instead of forcing horizontal overflow */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 min-w-0">
          <div className="flex items-center gap-1 text-[12px] text-text/80 bg-background px-2 py-1 rounded-[2px] border border-border">
            <Camera className="w-3.5 h-3.5" />
            {evidenceCount}
          </div>

          <GeofenceProof state={geofenceState} />

          <SyncStatus state={syncState} />

          <StatusBadge
            status={currentStatus.semantic}
            label={currentStatus.label}
          />
        </div>
      </div>
    );
  }

  // Worker mobile field view
  return (
    <div
      className={cn(
        "flex flex-col p-4 bg-surface border border-border rounded-[2px] gap-3",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[12px] font-medium text-text/80 uppercase tracking-wider mb-0.5">
            {id}
          </span>

          <span className="text-[16px] font-bold text-text leading-tight">
            {type}
          </span>
        </div>

        <StatusBadge
          status={currentStatus.semantic}
          label={currentStatus.label}
        />
      </div>

      <div className="flex flex-col gap-2 bg-background p-3 rounded-[2px] border border-border/50">
        <div className="flex items-center justify-between text-[14px]">
          <span className="text-text/80 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            Location
          </span>

          <span className="text-text font-medium">{locationName}</span>
        </div>

        <div className="flex items-center justify-between text-[14px]">
          <span className="text-text/80 flex items-center gap-1.5">
            <User className="w-4 h-4" />
            Inspector
          </span>

          <span className="text-text font-medium">{actorName}</span>
        </div>

        <div className="flex items-center justify-between text-[14px]">
          <span className="text-text/80 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Time
          </span>

          <span className="text-text font-medium">{timestamp}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-1">
        <GeofenceProof state={geofenceState} />

        <SyncStatus state={syncState} />

        <div className="ml-auto flex items-center gap-1.5 text-[12px] font-medium text-text px-2 py-1 bg-border/20 rounded-[2px]">
          <Camera className="w-3.5 h-3.5" />
          {evidenceCount} files
        </div>
      </div>
    </div>
  );
}