"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GovUtilityBar } from "./GovUtilityBar";
import { PrototypeNotice } from "./PrototypeNotice";
import { BrandLockup } from "./BrandLockup";
import { GovernmentFooter } from "./GovernmentFooter";
import { useT } from "@/i18n/LanguageProvider";
import type { MessageKey } from "@/i18n/messages.en";
import { cn } from "@/utils/cn";

interface WorkspaceLink {
  key: MessageKey;
  href: string;
}

/** The four screens the integrated prototype actually implements. */
const WORKSPACE_LINKS: WorkspaceLink[] = [
  { key: "work.nav.dashboard", href: "/dashboard" },
  { key: "work.nav.hazards", href: "/hazards" },
  { key: "work.nav.risk", href: "/risk" },
  { key: "work.nav.audit", href: "/audit" },
];

/**
 * The shell for the signed-in side of the prototype.
 *
 * It reuses the public masthead's utility strip and prototype notice — the same
 * government framing and the same honesty about what this is — and adds a
 * workspace navigation bar. There is no authentication service behind it, so it
 * shows no user avatar, no session menu and no sign-out: nothing that would
 * imply a verified government sign-in the backend cannot perform.
 */
export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const t = useT();
  const pathname = usePathname();

  return (
    <>
      <header>
        <GovUtilityBar />
        <PrototypeNotice />

        <div className="w-full bg-surface border-b border-border">
          <div className="mx-auto max-w-content px-4 md:px-6">
            <div className="flex items-center justify-between gap-4 py-3">
              <BrandLockup className="min-w-0 shrink rounded-sm" />

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 shrink-0 min-h-[40px] px-2 text-[0.8125rem] font-medium text-primary hover:underline underline-offset-2 rounded-sm"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t("work.backToSite")}</span>
                <span className="sm:hidden">{t("nav.home")}</span>
              </Link>
            </div>
          </div>
        </div>

        <nav
          aria-label={t("work.nav")}
          className="w-full bg-band border-b border-border"
        >
          <div className="mx-auto max-w-content px-4 md:px-6">
            <ul className="flex flex-wrap items-stretch -mx-1">
              {WORKSPACE_LINKS.map(({ key, href }) => {
                // /hazards must stay current on /hazards/HZRD-… too.
                const active =
                  pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <li key={href} className="px-1">
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex items-center min-h-[44px] px-3 text-[0.875rem] font-medium rounded-sm",
                        "border-b-2 -mb-[1px]",
                        active
                          ? "border-primary text-primary"
                          : "border-transparent text-text hover:border-border"
                      )}
                    >
                      {t(key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1} className="bg-background">
        <div className="mx-auto max-w-content px-4 md:px-6 py-8 sm:py-10">
          {children}
        </div>
      </main>

      <GovernmentFooter />
    </>
  );
}

/** The page title block every workspace screen opens with. */
export function WorkspaceHeading({
  title,
  description,
  meta,
}: {
  title: string;
  description?: string;
  /** A timestamp or provenance line, rendered quieter than the description. */
  meta?: string;
}) {
  return (
    <div className="max-w-[80ch]">
      <h1 className="text-[1.625rem] sm:text-[1.875rem] font-bold tracking-tight text-text">
        {title}
      </h1>
      {description && (
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-textMuted">
          {description}
        </p>
      )}
      {meta && (
        <p className="mt-2 text-[0.8125rem] text-textMuted">{meta}</p>
      )}
    </div>
  );
}
