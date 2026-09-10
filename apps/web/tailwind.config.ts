import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F3EA",
        surface: "#FFFDF8",
        primary: "#8C4A2F",
        accent: "#D4A72C",
        success: "#4F5D4A",
        danger: "#C6472D",
        text: "#2F3A44",
        border: "#D8CCBA",

        // Accessible text variants
        warningInk: "#7A5A00",
        dangerInk: "#A53A24",
      },
    },
  },
  plugins: [],
};

export default config;