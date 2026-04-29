// src/app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "@/app/globals.css";
import DynamicNavbar from "@/components/common/navbars/DynamicNavbar";
import FooterGuard from "@/components/common/footer/FooterGuard";

// Cấu hình Font Serif cho tiêu đề bay bổng
const playfair = Playfair_Display({
  subsets: ["vietnamese"],
  variable: "--font-playfair",
});

// Cấu hình Font Sans cho nội dung dễ đọc
const montserrat = Montserrat({
  subsets: ["vietnamese"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Becoming Blooming | Chậm rãi lớn lên, dịu dàng nở hoa",
  description: "Blog chia sẻ về phát triển bản thân, sức khỏe và tài chính.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌸</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="overflow-x-hidden">
        <div className="web-container">
          <DynamicNavbar />
          <main className="flex flex-1 flex-col animate-bloom">{children}</main>
          <FooterGuard />
        </div>
      </body>
    </html>
  );
}
