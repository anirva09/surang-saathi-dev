import React from "react";
import { cn } from "@/utils/cn";
import { Sparkles } from "lucide-react";
import { ChoiceRow } from "./ChoiceRow";

export type SeverityLevel = "low" | "medium" | "high";

export interface SeveritySelectorProps {
  value?: SeverityLevel;
  onChange: (value: SeverityLevel) => void;
  aiSuggestion?: SeverityLevel;
  className?: string;
}

export function SeveritySelector({ value, onChange, aiSuggestion, className }: SeveritySelectorProps) {
  const options: { value: SeverityLevel; label: string; color: string }[] = [
    { value: "low", label: "Low Severity", color: "text-success" },
    { value: "medium", label: "Medium Severity", color: "text-warningInk" },
    { value: "high", label: "High Severity", color: "text-dangerInk" },
  ];

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-medium text-text">Severity Level</label>
        {aiSuggestion && (
          <div className="flex items-center gap-1.5 text-[12px] text-primary font-medium bg-primary/5 px-2 py-1 rounded-[2px] w-fit border border-primary/20">
            <Sparkles className="w-3 h-3" />
            AI Suggests: {options.find(o => o.value === aiSuggestion)?.label}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <ChoiceRow
            key={option.value}
            name="severity"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            label={option.label}
            className={value === option.value ? option.color : ""}
          />
        ))}
      </div>
    </div>
  );
}


