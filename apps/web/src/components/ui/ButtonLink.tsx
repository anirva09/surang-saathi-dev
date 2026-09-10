import React from "react";
import Link from "next/link";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./Button";

export interface ButtonLinkProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Link>, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/**
 * A navigation target that carries Button semantics. Kept separate from
 * `Button` so links stay real links: keyboard, middle-click and copy-link all
 * behave the way a government portal user expects.
 */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      data-variant={variant}
      data-size={size}
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}
