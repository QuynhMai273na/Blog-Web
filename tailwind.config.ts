// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bloom: {
          rose: "#D4748E",
          "rose-deep": "#C25E7A",
          "rose-light": "#FDEEF2",
          "rose-border": "#F2D4DC",
          sage: "#6B8E5A",
          "sage-light": "#EDF6EE",
          sky: "#B3C9E8",
          "sky-deep": "#4A7CB5",
          peach: "#F5C89A",
          golden: "#E8CBA0",
          ink: "#5C3347",
          muted: "#8A6070",
          faint: "#B8A0AC",
          bg: "#FFF8F5",
          "bg-alt": "#FEF4F7",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Lora", "Georgia", "serif"],
        ui: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "bloom-sm": "8px",
        "bloom-md": "16px",
        "bloom-lg": "24px",
        "bloom-pill": "999px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
