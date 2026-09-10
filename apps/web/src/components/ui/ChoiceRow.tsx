import React from "react";
import { cn } from "@/utils/cn";

export interface ChoiceRowProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "onChange"> {
  type?: "radio" | "checkbox";
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  coLabel?: string;
  disabled?: boolean;
}

export const ChoiceRow = React.forwardRef<HTMLInputElement, ChoiceRowProps>(
  ({ className, type = "radio", name, value, checked, onChange, label, coLabel, disabled, ...props }, ref) => {
    return (
      <label
        className={cn(
          "flex items-center gap-3 p-3 min-h-[48px] border border-border bg-surface cursor-pointer rounded-[2px] transition-colors hover:bg-black/5",
          disabled && "opacity-50 pointer-events-none",
          checked && "border-primary bg-primary/5",
          className
        )}
        {...props}
      >
        <input
          ref={ref}
          type={type}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="w-5 h-5 text-primary focus:ring-accent border-border accent-primary"
        />
        <div className="flex flex-col">
          <span className="text-[14px] text-text font-medium leading-tight">{label}</span>
          {coLabel && <span className="text-[12px] text-text/80 leading-tight mt-0.5">{coLabel}</span>}
        </div>
      </label>
    );
  }
);
ChoiceRow.displayName = "ChoiceRow";


