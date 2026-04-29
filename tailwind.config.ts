// tailwind.config.js — Becoming Blooming
// Works with Tailwind CSS v3

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Colors ──────────────────────────────────────────────
      colors: {
        blush: {
          light: "#fce8eb",
          DEFAULT: "#f2a7b0",
          dark: "#c9606e",
        },
        rose: "#e8768a",
        cream: "#fdf6f0",
        parchment: "#f5ece4",
        sage: {
          light: "#e8efe5",
          DEFAULT: "#a8b89a",
        },
        gold: "#d4a96a",
        mocha: {
          DEFAULT: "#4a2c2a",
          mid: "#6b3f3a",
        },
        border: {
          soft: "#f0e6e0",
          DEFAULT: "#ead9d3",
        },
        text: {
          primary: "#3a2520",
          secondary: "#7a5a55",
          muted: "#b09090",
          inverse: "#fdf6f0",
        },
      },

      // ── Typography ───────────────────────────────────────────
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        serif: ["'Lora'", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
      },

      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem" }],
        xs: ["0.72rem", { lineHeight: "1.1rem" }],
        sm: ["0.8rem", { lineHeight: "1.25rem" }],
        base: ["0.875rem", { lineHeight: "1.5rem" }],
        md: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.1rem", { lineHeight: "1.5rem" }],
        xl: ["1.35rem", { lineHeight: "1.4rem" }],
        "2xl": ["1.6rem", { lineHeight: "1.3rem" }],
        "3xl": ["2rem", { lineHeight: "1.2rem" }],
        "4xl": ["2.5rem", { lineHeight: "1.15rem" }],
        "5xl": ["3.2rem", { lineHeight: "1.1rem" }],
      },

      // ── Border Radius ────────────────────────────────────────
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
        full: "9999px",
      },

      // ── Box Shadows ──────────────────────────────────────────
      boxShadow: {
        soft: "0 2px 12px rgba(74, 44, 42, 0.06)",
        card: "0 4px 24px rgba(74, 44, 42, 0.08)",
        hover: "0 8px 32px rgba(74, 44, 42, 0.14)",
        pink: "0 4px 12px rgba(200, 96, 110, 0.3)",
      },

      // ── Spacing ──────────────────────────────────────────────
      spacing: {
        18: "72px",
        22: "88px",
        sidebar: "220px",
      },

      // ── Max Width ────────────────────────────────────────────
      maxWidth: {
        content: "760px",
        wide: "1100px",
      },

      // ── Background Gradients ─────────────────────────────────
      backgroundImage: {
        "hero-glow":
          "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(242,167,176,0.18) 0%, transparent 70%), " +
          "radial-gradient(ellipse 50% 40% at 80% 70%, rgba(168,184,154,0.12) 0%, transparent 70%)",
        "thumb-yoga": "linear-gradient(135deg, #e8efe5 0%, #d5e8cc 100%)",
        "thumb-finance": "linear-gradient(135deg, #fef3e2 0%, #f5e5c8 100%)",
        "thumb-parenting": "linear-gradient(135deg, #fce8eb 0%, #f5d5da 100%)",
        "thumb-health": "linear-gradient(135deg, #f0e8f5 0%, #e5d5ef 100%)",
        "thumb-life": "linear-gradient(135deg, #e8f0f8 0%, #d5e5f0 100%)",
      },

      // ── Transitions ──────────────────────────────────────────
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
      },

      // ── Animation ────────────────────────────────────────────
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        bloom: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease both",
        "fade-in": "fade-in 0.4s ease both",
        bloom: "bloom 3s ease-in-out infinite",
      },
    },
  },
  plugins: [
    // Optional: uncomment if using @tailwindcss/typography for article body
    require("@tailwindcss/typography"),
  ],
};
