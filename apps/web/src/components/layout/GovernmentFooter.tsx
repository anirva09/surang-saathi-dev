"use client";

import React from "react";
import Link from "next/link";
import { Linkedin, Youtube } from "lucide-react";
import { SurangMark } from "./SurangMark";
import { FOOTER_LINKS } from "@/data/site/home";
import { useT } from "@/i18n/LanguageProvider";

/**
 * Government-service footer.
 *
 * The Golden Master places a Ministry lockup at the left and the Digital India
 * mark at the right. Neither is reproduced: this is a student prototype and
 * both would read as endorsement. The slots keep their geometry — brand
 * identity left, project mark right — filled with the project's own identity
 * and an explicit prototype statement.
 */
export function GovernmentFooter() {
  const t = useT();

  return (
    <footer
      id="contact"
      className="w-full bg-surface border-t border-border scroll-mt-24"
    >
      <div className="mx-auto max-w-content px-4 md:px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0 shrink-0">
            <span className="shrink-0 w-9 h-9" aria-hidden="true">
              <SurangMark className="w-full h-full" />
            </span>
            <div className="min-w-0">
              <p className="text-[0.8125rem] font-bold text-text leading-tight">
                {t("brand.name")}
              </p>
              <p className="text-[0.6875rem] text-textMuted leading-tight mt-0.5">
                {t("brand.descriptor")}
              </p>
            </div>
          </div>

          <nav aria-label={t("nav.footer")} className="min-w-0">
            <ul className="flex flex-wrap items-center gap-x-1 gap-y-1">
              {FOOTER_LINKS.map((link, i) => (
                <li key={`${link.key}-${link.href}`} className="flex items-center">
                  {i > 0 && (
                    <span className="text-border px-1" aria-hidden="true">
                      |
                    </span>
                  )}
                  <Link
                    href={link.href}
                    className="inline-flex items-center min-h-[36px] px-1 text-[0.8125rem] text-textMuted hover:text-primary hover:underline underline-offset-2 rounded-sm"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <p className="text-[0.6875rem] font-bold uppercase tracking-wider text-primary border border-primary/40 bg-primary/5 rounded-sm px-2 py-1">
              {t("footer.sihBadge")}
              <span className="block font-medium tracking-normal normal-case text-textMuted">
                {t("footer.sihSub")}
              </span>
            </p>
            <ul className="flex items-center gap-1">
              <li>
                <a
                  href="https://www.youtube.com/"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-sm text-textMuted hover:text-primary hover:bg-text/5"
                >
                  <Youtube className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only">{t("footer.youtube")}</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-sm text-textMuted hover:text-primary hover:bg-text/5"
                >
                  <Linkedin className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only">{t("footer.linkedin")}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-borderSoft bg-utility">
        <div className="mx-auto max-w-content px-4 md:px-6 py-3">
          <p className="text-[0.6875rem] leading-relaxed text-textMuted">
            <span className="font-bold text-text">
              {t("footer.disclaimerTitle")}
            </span>{" "}
            {t("footer.disclaimer")} {t("footer.domainNote")}
          </p>
        </div>
      </div>
    </footer>
  );
}
