import React from "react";
import { cn } from "@/utils/cn";
import { CheckCircle, AlertCircle, AlertTriangle, Clock, XCircle, LucideIcon } from "lucide-react";

export type SemanticStatus = "success" | "warning" | "danger" | "info" | "neutral";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: SemanticStatus;
  label: string;
  icon?: LucideIcon;
}

export function StatusBadge({ status, label, icon: Icon, className, ...props }: StatusBadgeProps) {
  const statusStyles: Record<SemanticStatus, { bg: string; text: string; defaultIcon: LucideIcon }> = {
    success: { bg: "bg-success/10", text: "text-success", defaultIcon: CheckCircle },
    warning: { bg: "bg-accent/10", text: "text-warningInk", defaultIcon: AlertTriangle },
    danger: { bg: "bg-danger/10", text: "text-dangerInk", defaultIcon: XCircle },
    info: { bg: "bg-primary/10", text: "text-primary", defaultIcon: AlertCircle },
    neutral: { bg: "bg-border/30", text: "text-text", defaultIcon: Clock },
  };

  const config = statusStyles[status];
  const IconComponent = Icon || config.defaultIcon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[12px] font-medium border border-transparent",
        config.bg,
        config.text,
        className
      )}
      {...props}
    >
      <IconComponent className="w-3.5 h-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}


