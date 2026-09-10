import React from "react";
import { cn } from "@/utils/cn";
import { Button } from "./Button";
import { AlertTriangle, Info } from "lucide-react";

export type ConfirmVariant = "commit" | "danger";

export interface ConsequenceConfirmProps {
  title: string;
  explanation: string;
  variant: ConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText: string;
  cancelText?: string;
  className?: string;
}

export function ConsequenceConfirm({
  title,
  explanation,
  variant,
  onConfirm,
  onCancel,
  confirmText,
  cancelText = "Cancel",
  className
}: ConsequenceConfirmProps) {
  const isDanger = variant === "danger";

  return (
    <div className={cn("flex flex-col border border-border bg-surface rounded-[2px] p-4 max-w-md", className)}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "shrink-0 mt-0.5",
          isDanger ? "text-dangerInk" : "text-success"
        )}>
          {isDanger ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[16px] font-bold text-text leading-tight">{title}</h3>
          <p className="text-[14px] text-text/80 leading-snug">{explanation}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6">
        <Button variant="ghost" onClick={onCancel}>{cancelText}</Button>
        <Button variant={variant} onClick={onConfirm}>{confirmText}</Button>
      </div>
    </div>
  );
}


