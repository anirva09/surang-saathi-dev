"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { NAV_ITEMS } from "@/data/site/home";
import { useT } from "@/i18n/LanguageProvider";

export function DesktopNavigation({ className }: { className?: string }) {
  const pathname = usePathname();
  const t = useT();

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <nav
      aria-label={t("nav.primary")}
      className={cn("hidden lg:flex lg:flex-1 lg:justify-center", className)}
    >
      <ul className="flex items-center gap-x-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center min-h-[44px] px-3 text-[0.875rem] font-medium rounded-sm transition-colors",
                  active ? "text-primary" : "text-text hover:text-primary"
                )}
              >
                {t(item.key)}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-3 right-3 bottom-1 h-[2px] rounded-sm",
                    active ? "bg-primary" : "bg-transparent"
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
