import type { Config } from "tailwindcss";

/**
 * Surang Saathi locked design system.
 *
 * Colour values are sampled from the Golden Master homepage rather than
 * carried over from the previous direction. Where a token also carries domain
 * meaning (danger, warningInk, dangerInk) the locked semantic value is kept,
 * because those encode safety status, not visual style.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Surfaces ──────────────────────────────────────────────
        background: "#F7F3EA", // warm official paper
        surface: "#FAF6EF", // cards, nav, panels
        surfaceStrong: "#FEFCF8", // raised cards (stats strip)
        utility: "#F5EFE3", // government utility strip
        band: "#EEE7D9", // credibility band tint

        // ── Brand ─────────────────────────────────────────────────
        primary: "#8F3E21", // institutional rust / terracotta
        primaryHover: "#7A3419",
        accent: "#C58729", // restrained ochre

        // ── Text ──────────────────────────────────────────────────
        text: "#1C2530", // deep charcoal
        textMuted: "#5B6570", // government-document grey
        stat: "#1C2F49", // deep slate used for statistics

        // ── Status (locked domain semantics) ──────────────────────
        success: "#515C40",
        danger: "#C6472D",
        warningInk: "#7A5A00",
        dangerInk: "#A53A24",

        // ── Lines ─────────────────────────────────────────────────
        border: "#D8CCBA", // warm stone
        borderSoft: "#E7DECF",
      },
      fontFamily: {
        // Devanagari-capable stacks, resolved at runtime from local fonts.
        // No build-time network fetch; see globals.css for the swap point.
        sans: ["var(--font-sans)"],
        devanagari: ["var(--font-devanagari)"],
      },
      maxWidth: {
        content: "1280px", // Golden Master content column
      },
      borderRadius: {
        // Near-square institutional geometry. Nothing above 4px.
        sm: "2px",
        DEFAULT: "3px",
        md: "4px",
      },
      boxShadow: {
        // Elevation is used sparingly and never for decoration.
        card: "0 1px 2px rgba(28, 37, 48, 0.04)",
        raised: "0 2px 6px rgba(28, 37, 48, 0.07)",
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
    },
  },
  plugins: [],
};

export default config;
