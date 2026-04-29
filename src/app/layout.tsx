import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import DynamicNavbar from "@/components/common/navbars/DynamicNavbar";
import Footer from "@/components/common/Footer";

// 1. Cấu hình Font chữ
const playfair = Playfair_Display({
  subsets: ["vietnamese"],
  variable: "--font-playfair",
});

const montserrat = Montserrat({
  subsets: ["vietnamese"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Becoming Blooming | Chậm rãi lớn lên",
  description: "Blog chia sẻ về lối sống dịu dàng",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${playfair.variable} ${montserrat.variable}`}>
      {/* 2. Thiết lập Flexbox để Footer luôn ở dưới cùng */}
      <body className="font-sans bg-cream text-sage-800 antialiased min-h-screen flex flex-col">
        {/* Navbar thông minh tự nhận diện trang */}
        <DynamicNavbar />

        {/* 3. Phần nội dung chính (flex-grow để đẩy Footer xuống) */}
        <main className="flex-grow">{children}</main>

        {/* Footer y hệt hình mẫu bạn gửi */}
        <Footer />
      </body>
    </html>
  );
}
