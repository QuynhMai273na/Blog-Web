"use client";

import { usePathname } from "next/navigation";
import NavbarMain from "./NavbarMain";
import NavbarDetail from "./NavbarDetail";
import NavbarSub from "./NavbarSub";

export default function DynamicNavbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/posts/")) {
    return <NavbarDetail category="Yoga & Sức khỏe" />;
  }

  if (pathname.includes("/login") || pathname.includes("/register")) {
    return <NavbarSub />;
  }

  const subRoutes = ["/contact", "/about", "/posts"];
  if (subRoutes.some((route) => pathname === route)) {
    return <NavbarSub />;
  }

  return <NavbarMain />;
}
