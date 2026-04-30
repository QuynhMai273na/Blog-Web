// tailwind.config.ts
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Tông Xanh Pastel (Sage) cho sự chuyên nghiệp, nhẹ nhàng
        text_primary: "#3a2520", // Màu chữ chính đậm
        text_secondary: "#7a5a55", // Màu chữ chính nâu nhạt
        sage: {
          50: "#F1F8F5",
          100: "#D1E7DD", // Nền cho Tag "Yoga"
          300: "#A8C69F", // Màu nhấn xanh lá
          500: "#558a5d",
          800: "#2D3E2F", // Màu chữ tiêu đề đậm
        },
        // Tông Hồng Pastel (Rose) cho sự dịu dàng
        rose: {
          50: "#FFF5F6",
          100: "#fce3e5", // Nền cho Tag "Parenting"
          200: "#E5B0B0",
          300: "#D69CA1", // Màu chữ tiêu đề hồng
          400: "#d96e83",
        },
        // Tông Vàng Pastel cho Tài chính cá nhân
        sand: {
          100: "#F9F1E6", // Nền cho Tag "Tài chính"
          200: "#E6D5B8",
          300: "#d1b483", // Màu chữ tiêu đề vàng
          500: "#c98e55",
        },
        light_cream: "#fffef5", // Màu nền sáng cho các section
        cream: "#f8f5ed", // Màu nền giấy cũ toàn web
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"], // Tiêu đề bay bổng
        sans: ["var(--font-montserrat)", "sans-serif"], // Nội dung dễ đọc
      },
      fontSize: {
        xs: ["0.8rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.5" }],
        xl: ["1.25rem", { lineHeight: "1.4" }],
        "2xl": ["1.5rem", { lineHeight: "1.3" }],
        "3xl": ["1.875rem", { lineHeight: "1.3" }],
        "4xl": ["2.25rem", { lineHeight: "1.25" }],
        "5xl": ["3rem", { lineHeight: "1.2" }],
        "6xl": ["3.75rem", { lineHeight: "1.15" }],
        "7xl": ["3.75rem", { lineHeight: "1.15" }],
        "8xl": ["3.75rem", { lineHeight: "1.15" }],
        "9xl": ["3.75rem", { lineHeight: "1.15" }],
      },
      borderRadius: {
        "4xl": "2.5rem", // Bo góc lớn đặc trưng của các Card
      },
    },
  },
  plugins: [typography],
};
export default config;
