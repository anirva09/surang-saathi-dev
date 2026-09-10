"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CREDIBILITY_CTA, CREDIBILITY_MEDIA } from "@/data/site/home";
import { useT } from "@/i18n/LanguageProvider";

/**
 * Full-bleed credibility band: mine landscape on the left, statement panel on
 * the right, with the angled seam from the Golden Master.
 *
 * The statement is the project's own and is labelled as such. The Golden
 * Master attributes it to the Ministry of Coal; reproducing that would
 * fabricate government endorsement of a student prototype, so the slot keeps
 * its geometry and carries an honest attribution instead.
 */
export function CredibilityBand() {
  const t = useT();

  return (
    <section
      aria-labelledby="credibility-heading"
      className="relative w-full bg-band border-y border-border overflow-hidden"
    >
      <h2 id="credibility-heading" className="sr-only">
        {t("band.heading")}
      </h2>

      <div className="lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="relative h-[180px] sm:h-[220px] lg:h-[228px]">
          <Image
            src={CREDIBILITY_MEDIA.src}
            alt={t("band.imageAlt")}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
          {CREDIBILITY_MEDIA.isPlaceholder && (
            <p className="absolute left-2 top-2 rounded-sm bg-text/75 px-2 py-1 text-[0.6875rem] font-medium text-surface">
              {t("hero.placeholder")}
            </p>
          )}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute inset-y-0 -right-px w-24 bg-band [clip-path:polygon(100%_0,100%_100%,0_100%)]"
          />
        </div>

        <div className="flex items-center px-4 md:px-6 lg:pl-0 lg:pr-10 py-8 lg:py-0">
          <div className="lg:max-w-[38ch]">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="text-[2.5rem] leading-[0.7] font-bold text-primary/35 select-none"
              >
                &ldquo;
              </span>
              <div className="min-w-0">
                <blockquote className="text-[1.0625rem] sm:text-[1.125rem] font-bold leading-snug text-text">
                  {t("band.quote")}
                </blockquote>
                <p className="mt-2 text-[0.75rem] text-textMuted">
                  — {t("band.attribution")}
                </p>
              </div>
            </div>

            <ButtonLink
              href={CREDIBILITY_CTA.href}
              variant="primary"
              size="md"
              className="mt-5"
            >
              {t(CREDIBILITY_CTA.key)}
              <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
