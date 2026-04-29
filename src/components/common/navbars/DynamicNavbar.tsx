"use client";
import { usePathname } from "next/navigation";
import NavbarMain from "./NavbarMain";
import NavbarDetail from "./NavbarDetail";
import NavbarSub from "./NavbarSub"; // Import thêm mẫu mới

export default function DynamicNavbar() {
  const pathname = usePathname();

  // 1. Navbar cho trang bài viết chi tiết
  if (pathname.startsWith("/posts/")) {
    return <NavbarDetail category="Yoga & Sức khỏe" />;
  }

  // 2. Navbar phụ cho trang Liên hệ, Về mình, hoặc danh sách Bài viết
  const subRoutes = ["/contact", "/about", "/posts"];
  if (subRoutes.some((route) => pathname === route)) {
    return <NavbarSub />;
  }

  // 3. Ẩn Navbar ở trang Auth
  if (pathname.includes("/login") || pathname.includes("/register")) {
    return null;
  }

  // 4. Mặc định là Navbar chính cho Trang chủ và các Category
  return <NavbarMain />;
}
