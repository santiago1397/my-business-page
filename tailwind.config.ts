import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        "pixel-square": ["var(--font-geist-pixel-square)", "ui-monospace", "monospace"],
        "pixel-grid": ["var(--font-geist-pixel-grid)", "ui-monospace", "monospace"],
        "pixel-circle": ["var(--font-geist-pixel-circle)", "ui-monospace", "monospace"],
        "pixel-triangle": ["var(--font-geist-pixel-triangle)", "ui-monospace", "monospace"],
        "pixel-line": ["var(--font-geist-pixel-line)", "ui-monospace", "monospace"],
      },
      colors: {
        brand: {
          purple: "#AD46FB",
          magenta: "#F845FA",
          mint: "#57F0E2",
          lime: "#EAF452",
          surface: "#F3F3F3",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up .6s ease-out both",
        "accordion-down": "accordion-down .2s ease-out",
        "accordion-up": "accordion-up .2s ease-out",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
