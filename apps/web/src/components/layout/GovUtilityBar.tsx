import React from "react";
import { AccessibilityControls } from "./AccessibilityControls";

/**
 * Thin government utility strip.
 *
 * No official emblem is reproduced. The square to the left is a neutral
 * reserved identity slot — see docs authenticity rules: government context may
 * be stated, endorsement may not be fabricated.
 *
 * AccessibilityControls is rendered exactly once. An earlier revision rendered
 * a desktop copy and a mobile copy, which gave the page two independent React
 * states writing the same root font-size — pressing A+ in one left the other
 * reporting aria-pressed="false" for the active size.
 */
export function GovUtilityBar() {
  return (
    <div className="w-full bg-surface border-b border-border">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              aria-hidden="true"
              className="shrink-0 w-5 h-5 border border-border bg-background"
            />
            <p className="text-[0.75rem] leading-tight text-text/80 min-w-0">
              <span className="font-medium text-text">भारत सरकार</span>
              <span className="mx-1.5" aria-hidden="true">
                |
              </span>
              <span>Government of India</span>
              <span className="hidden sm:inline">
                <span className="mx-1.5" aria-hidden="true">
                  ·
                </span>
                <span className="font-medium text-text">कोयला मंत्रालय</span>
                <span className="mx-1.5" aria-hidden="true">
                  |
                </span>
                <span>Ministry of Coal</span>
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              href="#main-content"
              className="text-[0.75rem] font-medium text-primary underline underline-offset-2 rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Skip to Main Content
            </a>
            <AccessibilityControls />
            <a
              href="/accessibility"
              className="hidden md:inline text-[0.75rem] font-medium text-primary underline underline-offset-2 rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
