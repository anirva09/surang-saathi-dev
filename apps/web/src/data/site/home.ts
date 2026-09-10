/**
 * Structure for the public homepage.
 *
 * Display text lives in `src/i18n/messages.*.ts`; this module holds only what
 * is language-independent — ids, routes, icon keys, image sources and the
 * numeric statistic values — plus the message key for each label.
 *
 * Honesty rules that still apply:
 *  - No figure here is live data. The statistics are illustrative prototype
 *    values and the UI labels them as such in every locale.
 *  - Nothing claims Government of India endorsement.
 */

import type { MessageKey } from "@/i18n/messages.en";

/* ─────────────────────────────  Navigation  ───────────────────────────── */

export interface NavItem {
  key: MessageKey;
  href: string;
  /** True when the destination exists in this build. */
  built: boolean;
}

/**
 * Items whose page does not exist yet point at the route they will occupy and
 * land on the honest "not built yet" screen. Two resolve to real anchors on
 * this page, so they are marked built.
 */
export const NAV_ITEMS: NavItem[] = [
  { key: "nav.home", href: "/", built: true },
  { key: "nav.about", href: "/about", built: false },
  { key: "nav.features", href: "/#features", built: true },
  { key: "nav.fieldTeams", href: "/for-field-teams", built: false },
  { key: "nav.managers", href: "/for-managers", built: false },
  { key: "nav.resources", href: "/resources", built: false },
  { key: "nav.contact", href: "/#contact", built: true },
];

export const FOOTER_LINKS: NavItem[] = [
  { key: "nav.home", href: "/", built: true },
  { key: "nav.about", href: "/about", built: false },
  { key: "nav.features", href: "/#features", built: true },
  { key: "nav.resources", href: "/resources", built: false },
  { key: "nav.contact", href: "/#contact", built: true },
  { key: "footer.privacy", href: "/privacy", built: false },
  { key: "footer.terms", href: "/terms", built: false },
  { key: "footer.help", href: "/help", built: false },
];

/* ───────────────────────────────  Hero  ──────────────────────────────── */

export const HERO_MEDIA = {
  src: "/images/hero-field-worker.placeholder.jpg",
  isPlaceholder: true,
} as const;

export const HERO_CTAS = {
  primary: { key: "hero.getStarted" as MessageKey, href: "/dashboard" },
  secondary: { key: "hero.knowMore" as MessageKey, href: "/#features" },
} as const;

export const HERO_PILLARS: MessageKey[] = [
  "hero.pillarPeople",
  "hero.pillarSafety",
  "hero.pillarAccountability",
  "hero.pillarSustainability",
];

/* ──────────────────────────────  Statistics  ──────────────────────────── */

export interface SiteStat {
  id: string;
  /** Numerals are locale-independent in this build and shown as-is. */
  value: string;
  labelKey: MessageKey;
  icon: "inspections" | "hazards" | "users" | "resolved";
  href: string;
}

export const SITE_STATS: SiteStat[] = [
  {
    id: "inspections",
    value: "12.4 lakh",
    labelKey: "stats.inspections",
    icon: "inspections",
    href: "/#features",
  },
  {
    id: "hazards",
    value: "8,932",
    labelKey: "stats.hazards",
    icon: "hazards",
    href: "/#features",
  },
  {
    id: "users",
    value: "1.8 lakh",
    labelKey: "stats.users",
    icon: "users",
    href: "/#features",
  },
  {
    id: "resolved",
    value: "92%",
    labelKey: "stats.resolved",
    icon: "resolved",
    href: "/#features",
  },
];

/* ────────────────────────────  Key features  ──────────────────────────── */

export interface Feature {
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  icon: "inspection" | "analytics" | "accountability" | "evidence" | "compliance";
  tone: "primary" | "accent" | "success" | "danger" | "stat";
}

export const FEATURES: Feature[] = [
  {
    id: "digital-inspections",
    titleKey: "features.inspections.title",
    bodyKey: "features.inspections.body",
    icon: "inspection",
    tone: "success",
  },
  {
    id: "analytics",
    titleKey: "features.analytics.title",
    bodyKey: "features.analytics.body",
    icon: "analytics",
    tone: "accent",
  },
  {
    id: "accountability",
    titleKey: "features.accountability.title",
    bodyKey: "features.accountability.body",
    icon: "accountability",
    tone: "stat",
  },
  {
    id: "evidence",
    titleKey: "features.evidence.title",
    bodyKey: "features.evidence.body",
    icon: "evidence",
    tone: "danger",
  },
  {
    id: "compliance",
    titleKey: "features.compliance.title",
    bodyKey: "features.compliance.body",
    icon: "compliance",
    tone: "primary",
  },
];

/* ────────────────────────────  Credibility band  ──────────────────────── */

export const CREDIBILITY_MEDIA = {
  src: "/images/mine-landscape.placeholder.jpg",
  isPlaceholder: true,
} as const;

export const CREDIBILITY_CTA = {
  key: "band.cta" as MessageKey,
  href: "/#features",
} as const;
