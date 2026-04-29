"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/common/footer/Footer";

const hiddenFooterRoutes = ["/login", "/register", "/forgot-password"];

export default function FooterGuard() {
  const pathname = usePathname();
  const hideFooter = hiddenFooterRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (hideFooter) {
    return null;
  }

  return <Footer />;
}
