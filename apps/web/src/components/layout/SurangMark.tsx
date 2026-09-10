import React from "react";

/**
 * Surang Saathi identity mark — the project's own geometry (a mine section
 * through a hillside with its adit). Deliberately not a government emblem.
 */
export function SurangMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Surang Saathi"
    >
      <path d="M24 6 L44 40 H4 Z" fill="#8C4A2F" />
      <path d="M24 6 L34 23 L24 23 Z" fill="#2F3A44" opacity="0.35" />
      <path d="M18 40 v-8 a6 6 0 0 1 12 0 v8 Z" fill="#FFFDF8" />
      <rect x="22.5" y="33" width="3" height="7" fill="#8C4A2F" />
      <path
        d="M8 34 H40"
        stroke="#D4A72C"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
    </svg>
  );
}
