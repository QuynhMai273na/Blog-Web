"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import AuthAvatarMenu from "@/components/auth/AuthAvatarMenu";

const mainLinks = [
  { name: "Về mình", href: "/about" },
  { name: "Liên hệ", href: "/contact" },
];

const postCategories = [
  { name: "Yoga & Sức khỏe", href: "/category/yoga" },
  { name: "Làm mẹ", href: "/category/parenting" },
  { name: "Tài chính cá nhân", href: "/category/finance" },
  { name: "Cuộc sống", href: "/category/life" },
];

export default function DynamicNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLLIElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsPostMenuOpen(false);
      }
      if (!searchRef.current?.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setIsPostMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const isActive = (href: string) => {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  const isPostsActive =
    pathname.startsWith("/posts") || pathname.startsWith("/category");
  const selectedPostCategorySlug = pathname.startsWith("/category/")
    ? pathname.split("/")[2]
    : pathname === "/posts" && searchParams.get("cat") !== "all"
      ? searchParams.get("cat")
      : null;
  const postMenuLabel =
    postCategories.find(
      (category) => category.href === `/category/${selectedPostCategorySlug}`,
    )?.name ?? "Bài viết";

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSearch = searchTerm.trim();
    const params = new URLSearchParams();
    if (trimmedSearch) {
      params.set("q", trimmedSearch);
    }

    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    router.push(params.toString() ? `/posts?${params.toString()}` : "/posts");
  };

  function closeMenus() {
    setIsPostMenuOpen(false);
    setIsMobileMenuOpen(false);
  }

  return (
    <>
      <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-[#f1ddd8] bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-6">
        <Link
          href="/"
          className="min-w-0 font-serif text-xl font-semibold leading-none sm:text-2xl"
          onClick={closeMenus}
        >
          <span className="text-[#d96e83]">Becoming</span>{" "}
          <span className="text-[#6b9b84] max-[390px]:hidden">Blooming</span>
        </Link>

        <ul className="hidden items-center gap-6 font-sans text-base font-medium tracking-[0.01em] text-[#667568] md:flex">
          <li>
            <Link
              href="/"
              className={`transition-colors hover:text-[#c85f70] ${
                isActive("/") ? "font-semibold text-[#c85f70]" : ""
              }`}
              onClick={closeMenus}
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

              <div
                role="menu"
                className={`soft-panel absolute left-1/2 top-8 z-50 w-56 -translate-x-1/2 overflow-hidden rounded-lg border border-[#ead9d3] bg-white py-2 text-left shadow-[0_12px_32px_rgba(74,44,42,0.16)] ${
                  isPostMenuOpen ? "soft-panel-open" : "soft-panel-closed"
                }`}
              >
                <Link
                  href="/posts"
                  role="menuitem"
                  onClick={closeMenus}
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
                    onClick={closeMenus}
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
          </li>

          {mainLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`transition-colors hover:text-[#c85f70] ${
                  isActive(link.href) ? "font-semibold text-[#c85f70]" : ""
                }`}
                onClick={closeMenus}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div ref={searchRef} className="relative flex items-center">
            <form
              onSubmit={handleSearchSubmit}
              className={[
                "fixed top-[4.25rem] z-50 flex items-center overflow-hidden rounded-full border border-[#f1ddd8] bg-white shadow-[0_12px_32px_rgba(74,44,42,0.14)] transition-all duration-300 md:static md:top-auto md:max-w-none md:shadow-none",
                isSearchOpen
                  ? "pointer-events-auto left-4 right-4 opacity-100 md:left-auto md:right-auto md:w-64"
                  : "pointer-events-none right-6 w-0 opacity-0",
              ].join(" ")}
            >
              <button
                type="submit"
                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#b09090] transition-colors hover:bg-[#fff5f6] hover:text-[#c85f70]"
                aria-label="Tìm kiếm"
              >
                <Search className="h-4 w-4" />
              </button>
              <input
                ref={searchInputRef}
                type="text"
                inputMode="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm bài viết..."
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm font-medium text-sage-800 outline-none placeholder:text-[#b09090]"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#9b8888] transition-colors hover:bg-[#fff5f6] hover:text-[#c85f70]"
                aria-label="Đóng tìm kiếm"
              >
                <X className="h-4 w-4" />
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setIsPostMenuOpen(false);
                setIsMobileMenuOpen(false);
                const nextSearchOpen = !isSearchOpen;
                if (nextSearchOpen) {
                  setSearchTerm(searchParams.get("q") ?? "");
                }
                setIsSearchOpen(nextSearchOpen);
              }}
              className={[
                "flex h-10 w-10 items-center justify-center rounded-full border border-[#f1ddd8] bg-white text-[#667568] shadow-sm transition-all hover:border-[#d96e83] hover:text-[#c85f70]",
                isSearchOpen ? "border-[#d96e83] text-[#c85f70]" : "",
              ].join(" ")}
              aria-label="Mở tìm kiếm"
              aria-expanded={isSearchOpen}
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <AuthAvatarMenu />
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(false);
              setIsPostMenuOpen(false);
              setIsMobileMenuOpen((value) => !value);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f1ddd8] bg-white text-[#667568] shadow-sm transition-all hover:border-[#d96e83] hover:text-[#c85f70] md:hidden"
            aria-label="Mở menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </nav>
      <div
        className={`soft-panel fixed left-3 right-3 top-[4.25rem] z-40 overflow-hidden rounded-[20px] border border-[#ead9d3] bg-white/98 shadow-[0_24px_70px_rgba(74,44,42,0.16)] ring-1 ring-rose-50 backdrop-blur-md md:hidden ${
          isMobileMenuOpen ? "soft-panel-open" : "soft-panel-closed"
        }`}
      >
        <div className="grid gap-1 p-2">
          <Link
            href="/"
            onClick={closeMenus}
            className={`rounded-[14px] px-4 py-3 text-sm font-medium transition-colors hover:bg-[#fff5f6] ${
              isActive("/") ? "text-[#c85f70]" : "text-[#667568]"
            }`}
          >
            Trang chủ
          </Link>
          <Link
            href="/posts"
            onClick={closeMenus}
            className={`rounded-[14px] px-4 py-3 text-sm font-medium transition-colors hover:bg-[#fff5f6] ${
              isActive("/posts") && !selectedPostCategorySlug
                ? "text-[#c85f70]"
                : "text-[#667568]"
            }`}
          >
            Tất cả bài viết
          </Link>
          {postCategories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              onClick={closeMenus}
              className={`rounded-[14px] px-4 py-3 text-sm font-medium transition-colors hover:bg-[#fff5f6] ${
                isActive(category.href)
                  ? "text-[#c85f70]"
                  : "text-[#667568]"
              }`}
            >
              {category.name}
            </Link>
          ))}
          <div className="my-1 h-px bg-rose-100" />
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenus}
              className={`rounded-[14px] px-4 py-3 text-sm font-medium transition-colors hover:bg-[#fff5f6] ${
                isActive(link.href) ? "text-[#c85f70]" : "text-[#667568]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="h-[57px] shrink-0" aria-hidden="true" />
    </>
  );
}
