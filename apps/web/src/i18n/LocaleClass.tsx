"use client";

import React from "react";
import { useLanguage } from "./LanguageProvider";

/**
 * Applies the Devanagari font stack to the whole document while Hindi is
 * active, so no component has to remember to opt in — and so English mode
 * never picks up Devanagari metrics.
 */
export function LocaleFontSync() {
  const { locale } = useLanguage();

  React.useEffect(() => {
    document.body.classList.toggle("locale-hi", locale === "hi");
  }, [locale]);

  return null;
}
