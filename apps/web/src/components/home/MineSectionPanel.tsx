import React from "react";

/**
 * Mine-section visual panel.
 *
 * Drawn as a geological cross-section in the project's own palette rather than
 * hotlinked stock photography or generated art: an opencast bench profile
 * above, strata below, and an underground gallery with survey depth markers.
 * Flat bands, 1px rules and dashed survey ticks keep it in the same visual
 * language as the rest of the portal.
 *
 * Composition note: the identity card sits over the upper-right of this panel
 * at large widths, so the headframe, haul road and gallery all sit in the left
 * two-thirds and that corner is left as open sky.
 */
export function MineSectionPanel({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 760 452"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Cross-section illustration of a coal mine: opencast benches and a headframe above ground, a coal seam and an underground gallery below, annotated with survey reduced-level markers."
    >
      {/* Sky */}
      <rect width="760" height="452" fill="#EFE6D2" />

      {/* Survey grid tick line */}
      <path
        d="M0 26 H760"
        stroke="#B08D68"
        strokeWidth="1"
        strokeDasharray="2 10"
        opacity="0.45"
      />

      {/* Distant ridgeline */}
      <path
        d="M0 104 L128 62 L250 96 L392 46 L544 86 L760 56 V140 H0 Z"
        fill="#CBB899"
      />

      {/* Opencast benches, stepped */}
      <path d="M0 140 H760 V184 H0 Z" fill="#BE9A73" />
      <path d="M0 184 H612 L656 208 H760 V228 H0 Z" fill="#A98259" />
      <path d="M0 228 H500 L548 254 H760 V276 H0 Z" fill="#946D48" />

      <g stroke="#7C5636" strokeWidth="1" opacity="0.5">
        <path d="M0 184 H612" />
        <path d="M0 228 H500" />
        <path d="M0 276 H760" />
      </g>

      {/* Haul road switchback */}
      <path
        d="M96 276 L236 228 L152 184 L318 152"
        stroke="#F2E9D6"
        strokeWidth="6"
        fill="none"
        opacity="0.6"
      />

      {/* Headframe over the shaft */}
      <g stroke="#5A4430" strokeWidth="3.5" fill="none">
        <path d="M150 152 v-64" />
        <path d="M124 152 L150 88 L176 152" />
        <path d="M134 120 H166" />
      </g>
      <circle cx="150" cy="82" r="7" fill="#8C4A2F" />

      {/* Haul truck on the middle bench */}
      <g fill="#5A4430">
        <path d="M286 200 h46 l9 11 h13 v11 h-68 z" />
        <circle cx="301" cy="226" r="6.5" />
        <circle cx="340" cy="226" r="6.5" />
      </g>

      {/* Strata */}
      <rect y="276" width="760" height="42" fill="#7E5F3E" />
      <rect y="318" width="760" height="38" fill="#654B33" />
      <rect y="356" width="760" height="96" fill="#4B3A2B" />

      {/* Coal seam */}
      <rect y="308" width="760" height="13" fill="#2F3A44" />
      <path
        d="M0 308 H760"
        stroke="#D4A72C"
        strokeWidth="1"
        strokeDasharray="6 6"
        opacity="0.65"
      />

      {/* Underground gallery */}
      <rect x="150" y="374" width="300" height="56" fill="#2F3A44" />
      <rect
        x="150"
        y="374"
        width="300"
        height="56"
        fill="none"
        stroke="#D4A72C"
        strokeWidth="1.5"
        opacity="0.85"
      />
      <g stroke="#D8CCBA" strokeWidth="3" opacity="0.6">
        <path d="M186 430 v-44" />
        <path d="M252 430 v-44" />
        <path d="M318 430 v-44" />
        <path d="M384 430 v-44" />
      </g>
      <circle cx="300" cy="396" r="8.5" fill="#D4A72C" opacity="0.9" />

      {/* Incline from the gallery back toward the shaft */}
      <path
        d="M450 402 L560 330 L560 314"
        stroke="#D8CCBA"
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="8 5"
        opacity="0.55"
      />

      {/* Survey reduced-level markers */}
      <g
        fontFamily="ui-monospace, monospace"
        fontSize="12"
        fill="#F5EDDC"
        opacity="0.95"
      >
        <g stroke="#F5EDDC" strokeWidth="1" opacity="0.6">
          <path d="M24 276 h18" />
          <path d="M24 318 h18" />
          <path d="M24 374 h18" />
        </g>
        <text x="48" y="280">RL 0 m</text>
        <text x="48" y="322">RL −40 m</text>
        <text x="48" y="378">RL −95 m</text>
      </g>

      {/* Section label, like a survey sheet */}
      <text
        x="640"
        y="444"
        textAnchor="end"
        fontFamily="ui-monospace, monospace"
        fontSize="11"
        fill="#E6D9C0"
        opacity="0.8"
      >
        SECTION A–A′
      </text>
    </svg>
  );
}
