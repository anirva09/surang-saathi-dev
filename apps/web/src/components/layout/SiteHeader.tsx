"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { GovUtilityBar } from "./GovUtilityBar";
import { PrototypeNotice } from "./PrototypeNotice";
import { BrandLockup } from "./BrandLockup";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { useT } from "@/i18n/LanguageProvider";

/**
 * The full public shell header as one `banner` landmark: utility strip,
 * prototype notice, brand row with navigation, and the portal entry point.
 */
export function SiteHeader() {
  const t = useT();

  return (
    <header>
      <GovUtilityBar />
      <PrototypeNotice />

      <div className="relative w-full bg-surface border-b border-border">
        <div className="mx-auto max-w-content px-4 md:px-6">
          <div className="flex items-center justify-between gap-4 py-3">
            <BrandLockup className="min-w-0 shrink rounded-sm" />

            <DesktopNavigation />

            <div className="flex items-center gap-1 shrink-0">
              <ButtonLink
                href="/dashboard"
                variant="primary"
                size="md"
                className="hidden sm:inline-flex"
              >
                {t("nav.login")}
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </ButtonLink>

              <ButtonLink
                href="/dashboard"
                variant="primary"
                size="md"
                className="sm:hidden"
                aria-label={t("nav.login")}
              >
                {t("nav.loginShort")}
              </ButtonLink>

              <MobileNavigation />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
