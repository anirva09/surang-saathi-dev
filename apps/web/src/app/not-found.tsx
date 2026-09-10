"use client";

import React from "react";
import { Construction } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { GovernmentFooter } from "@/components/layout/GovernmentFooter";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useT } from "@/i18n/LanguageProvider";

/**
 * Navigation points at the routes these pages will occupy. Until they exist
 * this screen answers honestly instead of showing a bare framework 404.
 */
export default function NotFound() {
  const t = useT();

  return (
    <>
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="bg-background">
        <div className="mx-auto max-w-content px-4 md:px-6 py-16">
          <div className="max-w-[68ch] border border-border bg-surface rounded-sm p-6 sm:p-8 shadow-card">
            <span
              className="inline-flex items-center justify-center w-11 h-11 rounded-sm bg-accent/20 text-warningInk"
              aria-hidden="true"
            >
              <Construction className="w-5 h-5" />
            </span>

            <h1 className="mt-5 text-[1.625rem] font-bold tracking-tight text-text">
              {t("notfound.title")}
            </h1>

            <p className="mt-3 text-[0.9375rem] leading-relaxed text-textMuted">
              {t("notfound.body1")}
            </p>

            <p className="mt-3 text-[0.9375rem] leading-relaxed text-textMuted">
              {t("notfound.body2")}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <ButtonLink href="/" variant="primary" size="lg">
                {t("notfound.home")}
              </ButtonLink>
              <ButtonLink href="/dashboard" variant="secondary" size="lg">
                {t("notfound.dashboard")}
              </ButtonLink>
            </div>
          </div>
        </div>
      </main>

      <GovernmentFooter />
    </>
  );
}
