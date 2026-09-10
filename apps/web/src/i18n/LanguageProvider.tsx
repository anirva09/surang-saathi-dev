"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { en, type MessageKey, type Messages } from "./messages.en";
import { hi } from "./messages.hi";

export type Locale = "en" | "hi";

const CATALOGUES: Record<Locale, Messages> = { en, hi };
const STORAGE_KEY = "surang-saathi.locale";

/**
 * English is the default and the fallback. Hindi is shown only after the user
 * explicitly selects it — never inferred from browser language, timezone or
 * geography, and never machine-translated at runtime.
 */
export const DEFAULT_LOCALE: Locale = "en";

/** Indian English and Indian Hindi, so dates and digit grouping read locally. */
const INTL_LOCALE: Record<Locale, string> = { en: "en-IN", hi: "hi-IN" };

export type MessageParams = Record<string, string | number>;

/** Substitutes `{name}` placeholders; an unknown placeholder is left intact. */
function interpolate(template: string, params?: MessageParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match
  );
}

interface LanguageContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: MessageKey, params?: MessageParams) => string;
  /** Digit grouping for the active locale (Indian grouping in both). */
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  /** Date and time of day, for "as of" stamps and audit rows. */
  formatDateTime: (iso: string) => string;
  /** Date only, for deadlines. */
  formatDate: (iso: string) => string;
  /** "3 days overdue" / "in 2 days", or "" when the input is unusable. */
  formatRelativeDays: (iso: string, now?: Date) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "hi";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start at English so server and first client render agree; a stored
  // preference is applied in an effect, after hydration.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Private mode or blocked storage: English stands.
    }
    if (isLocale(stored) && stored !== DEFAULT_LOCALE) {
      setLocaleState(stored);
    }
  }, []);

  // Keep the document language in step, so assistive technology announces the
  // right pronunciation and `:lang()` rules resolve correctly.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Preference simply does not persist; the session still switches.
    }
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    const catalogue = CATALOGUES[locale];
    const intl = INTL_LOCALE[locale];

    const t = (key: MessageKey, params?: MessageParams) =>
      // Falls back to English rather than rendering a raw key if a string is
      // ever missing at runtime.
      interpolate(catalogue[key] ?? en[key], params);

    return {
      locale,
      setLocale,
      t,
      formatNumber: (value, options) =>
        new Intl.NumberFormat(intl, options).format(value),
      formatDateTime: (iso) => {
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) return iso;
        return new Intl.DateTimeFormat(intl, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(date);
      },
      formatDate: (iso) => {
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) return iso;
        return new Intl.DateTimeFormat(intl, { dateStyle: "medium" }).format(
          date
        );
      },
      formatRelativeDays: (iso, now = new Date()) => {
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) return "";
        const days = Math.round(
          (date.getTime() - now.getTime()) / 86_400_000
        );
        return new Intl.RelativeTimeFormat(intl, { numeric: "auto" }).format(
          days,
          "day"
        );
      },
    };
  }, [locale, setLocale]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return context;
}

/** Convenience hook for components that only need to read strings. */
export function useT(): (key: MessageKey, params?: MessageParams) => string {
  return useLanguage().t;
}
