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
    <nav className="w-full bg-white/90 backdrop-blur-sm px-8 py-5 flex justify-between items-center sticky top-0 z-50 border-b border-rose-50">
      {/* Brand Identity */}
      <div className="font-serif text-2xl">
        <span className="text-rose-200">Becoming</span>{" "}
        <span className="text-sage-300 italic">Blooming</span>
      </div>

      {/* Simplified Menu */}
      <ul className="hidden md:flex gap-8 text-sage-800/70">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`hover:text-sage-300 transition-colors font-medium ${
                pathname === link.href ? "text-sage-300" : ""
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Auth Button */}
      <button className="px-6 py-2 border border-rose-100 text-rose-200/50 rounded-xl cursor-not-allowed">
        Đăng nhập
      </button>
    </nav>
  );
}
