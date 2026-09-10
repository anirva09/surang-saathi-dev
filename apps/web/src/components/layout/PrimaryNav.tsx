"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Safety Dashboard", href: "/dashboard" },
  { label: "Hazards", href: "/hazards" },
  { label: "Inspections", href: "/inspections" },
  { label: "Corrective Actions", href: "/corrective-actions" },
  { label: "Compliance", href: "/compliance" },
  { label: "Audit", href: "/audit" },
  { label: "Help & Resources", href: "/help" },
];

export function PrimaryNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Portal"
      className="w-full bg-primary text-surface border-b border-primary"
    >
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="portal-nav-menu"
          className="lg:hidden flex items-center gap-2 w-full min-h-[48px] py-2 text-[0.875rem] font-medium rounded-[2px]"
        >
          {open ? (
            <X className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Menu className="w-5 h-5" aria-hidden="true" />
          )}
          <span>{open ? "Close menu" : "Menu"}</span>
        </button>

        <ul
          id="portal-nav-menu"
          data-state={open ? "expanded" : "collapsed"}
          className={cn(
            "lg:flex lg:flex-wrap lg:items-center lg:gap-x-1",
            open ? "block pb-2 lg:pb-0" : "hidden"
          )}
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href} className="lg:shrink-0">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center min-h-[44px] lg:min-h-[42px] px-3 text-[0.875rem] font-medium rounded-[2px]",
                    "border-b-2 lg:border-b-[3px] transition-colors",
                    active
                      ? "border-accent bg-black/15"
                      : "border-transparent hover:bg-black/15"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
