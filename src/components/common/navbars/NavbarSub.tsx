"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarSub() {
  const pathname = usePathname();

  const links = [
    { name: "Trang chủ", href: "/" },
    { name: "Bài viết", href: "/posts" },
    { name: "Về mình", href: "/about" },
    { name: "Liên hệ", href: "/contact" },
  ];

  return (
    <>
      <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-[#f1ddd8] bg-white/95 px-6 py-3 shadow-sm backdrop-blur-sm">
        <Link
          href="/"
          className="font-serif text-2xl font-semibold leading-none"
        >
          <span className="text-[#d96e83]">Becoming</span>{" "}
          <span className="text-[#6b9b84] ">Blooming</span>
        </Link>

        <ul className="hidden items-center gap-6 font-sans text-base font-medium tracking-[0.01em] text-[#667568] md:flex">
          {links.map((link) => {
            // Sửa logic so sánh để tránh mất màu ở trang con
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`transition-colors hover:text-[#c85f70] ${
                    isActive ? "text-[#c85f70] font-semibold" : ""
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/login"
          className="rounded-lg border border-[#efc7cc] bg-white px-4 py-1.5 font-sans text-sm font-semibold text-[#c85f70] shadow-sm transition-all hover:border-[#d96e83] hover:bg-[#fff5f6] hover:text-[#a94556]"
        >
          Đăng nhập
        </Link>
      </nav>
      <div className="h-[57px] shrink-0" aria-hidden="true" />
    </>
  );
}
