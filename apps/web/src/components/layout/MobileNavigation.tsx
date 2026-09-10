"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { NAV_ITEMS } from "@/data/site/home";
import { useT } from "@/i18n/LanguageProvider";

/**
 * Below lg the navigation collapses to a disclosure. It is a real button with
 * aria-expanded and aria-controls, and the panel is a list of full-width links
 * with 48px targets — not a shrunk desktop row.
 */
export function MobileNavigation({ className }: { className?: string }) {
  const pathname = usePathname();
  const t = useT();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <div className={cn("lg:hidden", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="inline-flex items-center justify-center gap-2 min-w-[44px] min-h-[44px] px-2 sm:px-3 text-[0.875rem] font-medium text-text rounded-sm"
      >
        {open ? (
          <X className="w-5 h-5" aria-hidden="true" />
        ) : (
          <Menu className="w-5 h-5" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">
          {open ? t("nav.close") : t("nav.menu")}
        </span>
        <span className="sm:hidden sr-only">
          {open ? t("nav.closeMenu") : t("nav.openMenu")}
        </span>
      </button>

      <nav
        id="mobile-nav-panel"
        aria-label={t("nav.primary")}
        data-state={open ? "expanded" : "collapsed"}
        className={cn(
          "absolute left-0 right-0 top-full z-20 border-y border-border bg-surface shadow-raised",
          open ? "block" : "hidden"
        )}
      >
        <ul className="mx-auto max-w-content px-4 md:px-6 py-2">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <li
                key={item.key}
                className="border-b border-borderSoft last:border-b-0"
              >
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between min-h-[48px] text-[0.9375rem] font-medium",
                    active ? "text-primary" : "text-text"
                  )}
                >
                  {t(item.key)}
                  <ArrowRight className="w-4 h-4 text-textMuted" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
