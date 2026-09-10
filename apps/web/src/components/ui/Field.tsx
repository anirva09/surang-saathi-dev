import React, { useId } from "react";
import { cn } from "@/utils/cn";

export interface FieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label: string;
  coLabel?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: (props: { id: string; "aria-describedby"?: string }) => React.ReactNode;
}

export function Field({
  label,
  coLabel,
  required,
  hint,
  error,
  children,
  className,
  ...props
}: FieldProps) {
  const generatedId = useId();
  const id = `field-${generatedId}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const ariaDescribedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      <label htmlFor={id} className="text-[12px] font-medium text-text flex items-center gap-1">
        <span>{label}</span>
        {coLabel && <span className="text-text/80 italic">({coLabel})</span>}
        {required && <span className="text-dangerInk" aria-hidden="true">*</span>}
      </label>

      {children({ id, "aria-describedby": ariaDescribedBy })}

      {error && (
        <p id={errorId} className="text-[12px] text-dangerInk font-medium mt-0.5">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="text-[12px] text-text/80 mt-0.5">
          {hint}
        </p>
      )}
    </div>
  );
}


