import React from "react";
import { cn } from "@/utils/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "commit"
  | "danger"
  | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-surface hover:opacity-90",
  secondary: "bg-surface border border-border text-text hover:bg-black/5",
  ghost: "bg-transparent text-text hover:bg-black/5",
  commit: "bg-success text-surface hover:opacity-90",
  danger: "bg-danger text-surface hover:opacity-90",
  link: "text-primary underline bg-transparent p-0 hover:opacity-80",
};

const SIZES: Record<ButtonSize, string> = {
  lg: "h-12 px-6 text-sm min-h-[48px]", // 48px field primary
  md: "h-10 px-4 text-sm min-h-[40px]", // 40px default
  sm: "h-8 px-3 text-xs min-h-[32px]", // 32px desktop-dense only
};

const BASE =
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none rounded-[2px]";

/**
 * Shared class builder so anchors (`ButtonLink`) can carry identical button
 * semantics without duplicating the variant/size maps.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    BASE,
    VARIANTS[variant],
    variant === "link" ? "" : SIZES[size],
    className
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        data-variant={variant}
        data-size={size}
        className={buttonClasses({ variant, size, className })}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
