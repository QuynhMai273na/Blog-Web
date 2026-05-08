"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AuthAvatarMenu from "@/components/common/AuthAvatarMenu";

const mainLinks = [
  { name: "Về mình", href: "/about" },
  { name: "Liên hệ", href: "/contact" },
];

const postCategories = [
  { name: "Parenting", href: "/category/parenting" },
  { name: "Yoga & Sức khỏe", href: "/category/yoga" },
  { name: "Tài chính cá nhân", href: "/category/finance" },
  { name: "Cuộc sống", href: "/category/life" },
];

export default function DynamicNavbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLLIElement>(null);
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsPostMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const isActive = (href: string) => {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  const isPostsActive =
    pathname.startsWith("/posts") || pathname.startsWith("/category");
  const selectedPostCategorySlug =
    pathname.startsWith("/category/")
      ? pathname.split("/")[2]
      : pathname === "/posts" && searchParams.get("cat") !== "all"
        ? searchParams.get("cat")
        : null;
  const postMenuLabel =
    postCategories.find(
      (category) => category.href === `/category/${selectedPostCategorySlug}`,
    )?.name ?? "Bài viết";

  return (
    <>
      <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-[#f1ddd8] bg-white/95 px-6 py-3 shadow-sm backdrop-blur-sm">
        <Link
          href="/"
          className="font-serif text-2xl font-semibold leading-none"
          onClick={() => setIsPostMenuOpen(false)}
        >
          <span className="text-[#d96e83]">Becoming</span>{" "}
          <span className="text-[#6b9b84]">Blooming</span>
        </Link>

        <ul className="hidden items-center gap-6 font-sans text-base font-medium tracking-[0.01em] text-[#667568] md:flex">
          <li>
            <Link
              href="/"
              className={`transition-colors hover:text-[#c85f70] ${
                isActive("/") ? "font-semibold text-[#c85f70]" : ""
              }`}
              onClick={() => setIsPostMenuOpen(false)}
            >
              Trang chủ
            </Link>
          </li>

          <li
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setIsPostMenuOpen(true)}
          >
            <button
              type="button"
              className={`flex items-center gap-1 transition-colors hover:text-[#c85f70] ${
                isPostsActive ? "font-semibold text-[#c85f70]" : ""
              }`}
              aria-haspopup="menu"
              aria-expanded={isPostMenuOpen}
              onClick={() => setIsPostMenuOpen((value) => !value)}
            >
              {postMenuLabel}
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  isPostMenuOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {isPostMenuOpen && (
              <div
                role="menu"
                className="absolute left-1/2 top-8 z-50 w-56 -translate-x-1/2 overflow-hidden rounded-lg border border-[#ead9d3] bg-white py-2 text-left shadow-[0_12px_32px_rgba(74,44,42,0.16)]"
              >
                <Link
                  href="/posts"
                  role="menuitem"
                  onClick={() => setIsPostMenuOpen(false)}
                  className={`block px-4 py-2.5 font-sans text-sm transition hover:bg-[#fff5f6] hover:text-[#c85f70] ${
                    isActive("/posts") && !selectedPostCategorySlug
                      ? "font-semibold text-[#c85f70]"
                      : "text-[#667568]"
                  }`}
                >
                  Tất cả bài viết
                </Link>

                {postCategories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    role="menuitem"
                    onClick={() => setIsPostMenuOpen(false)}
                    className={`block px-4 py-2.5 font-sans text-sm transition hover:bg-[#fff5f6] hover:text-[#c85f70] ${
                      isActive(category.href) ||
                      category.href === `/category/${selectedPostCategorySlug}`
                        ? "font-semibold text-[#c85f70]"
                        : "text-[#667568]"
                    }`}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </li>

          {mainLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`transition-colors hover:text-[#c85f70] ${
                  isActive(link.href) ? "font-semibold text-[#c85f70]" : ""
                }`}
                onClick={() => setIsPostMenuOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <AuthAvatarMenu />
      </nav>
      <div className="h-[57px] shrink-0" aria-hidden="true" />
    </>
  );
}
