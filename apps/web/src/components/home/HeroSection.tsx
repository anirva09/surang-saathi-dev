"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { HERO_CTAS, HERO_MEDIA, HERO_PILLARS } from "@/data/site/home";
import { useT } from "@/i18n/LanguageProvider";

/**
 * Hero.
 *
 * Golden Master composition: copy column on the left, photographic mine
 * imagery filling the right and bleeding to the page edge, with the identity
 * panel over it.
 *
 * The copy comes first in the DOM so the h1 leads the reading order; from lg
 * the image is positioned absolutely, so source order costs nothing visually.
 *
 * The photograph is a clearly-named placeholder until project-owned imagery is
 * supplied. Its container, ratio and overlay geometry are final.
 */
export function HeroSection() {
  const t = useT();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full bg-background overflow-hidden"
    >
      {/* Copy */}
      <div className="relative z-10 mx-auto max-w-content px-4 md:px-6">
        <div className="lg:w-[56%] lg:pr-8 pt-10 pb-8 lg:py-20">
          <p className="text-[0.75rem] font-semibold uppercase tracking-eyebrow text-textMuted">
            {t("hero.eyebrow")}
          </p>

          <h1
            id="hero-heading"
            className="mt-4 text-[1.875rem] sm:text-[2rem] xl:text-[2.25rem] font-bold tracking-tight leading-[1.16] text-text"
          >
            {t("hero.headlineLead")}
            <span className="block text-primary">{t("hero.headlineAccent")}</span>
          </h1>

          <p className="mt-5 max-w-[52ch] text-[0.9375rem] sm:text-[1rem] leading-relaxed text-textMuted">
            {t("hero.body")}
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <ButtonLink href={HERO_CTAS.primary.href} variant="primary" size="lg">
              {t(HERO_CTAS.primary.key)}
              <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href={HERO_CTAS.secondary.href}
              variant="secondary"
              size="lg"
            >
              {t(HERO_CTAS.secondary.key)}
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Imagery */}
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-[44%]">
        <div className="relative h-[280px] sm:h-[360px] lg:h-full">
          <Image
            src={HERO_MEDIA.src}
            alt={t("hero.imageAlt")}
            fill
            priority
            sizes="(min-width: 1024px) 44vw, 100vw"
            className="object-cover"
          />

          {/* Functional edge scrim so paper and photograph meet without a seam. */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-background to-transparent"
          />

          {HERO_MEDIA.isPlaceholder && (
            <p className="absolute left-2 top-2 rounded-sm bg-text/75 px-2 py-1 text-[0.6875rem] font-medium text-surface">
              {t("hero.placeholder")}
            </p>
          )}

          {/* Identity panel — active language only */}
          <div className="absolute right-3 bottom-3 sm:right-6 sm:bottom-6 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2 w-[min(17rem,calc(100%-1.5rem))] border border-border bg-surface rounded-sm p-4 sm:p-5 shadow-card">
            <p className="text-[1.25rem] sm:text-[1.375rem] font-bold leading-snug text-text">
              {t("hero.panelLine1")}
              <span className="block text-primary">{t("hero.panelLine2")}</span>
            </p>

            <div
              className="mt-3 flex h-[3px] w-24 overflow-hidden rounded-sm"
              aria-hidden="true"
            >
              <span className="flex-1 bg-[#FF9933]" />
              <span className="flex-1 bg-[#F2F2F2]" />
              <span className="flex-1 bg-[#138808]" />
            </div>

            <ul className="mt-4 flex flex-col gap-1.5 border-l-2 border-primary pl-3">
              {HERO_PILLARS.map((key) => (
                <li
                  key={key}
                  className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-textMuted"
                >
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
