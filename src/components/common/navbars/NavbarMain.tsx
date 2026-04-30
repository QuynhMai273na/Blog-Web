import Link from "next/link";

export default function NavbarMain() {
  const menuItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Parenting", href: "/category/parenting" },
    { name: "Yoga & Sức khỏe", href: "/category/yoga" },
    { name: "Tài chính", href: "/category/finance" },
    { name: "Cuộc sống", href: "/category/life" },
  ];

  return (
    <>
      <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-rose-100 bg-white px-6 py-3 shadow-sm">
        <Link
          href="/"
          className="font-serif text-2xl font-semibold leading-none"
        >
          <span className="text-[#d96e83]">Becoming</span>{" "}
          <span className="text-[#6b9b84] italic">Blooming</span>
        </Link>

        <ul className="hidden items-center gap-6 font-sans text-base font-medium tracking-[0.01em] text-[#667568] md:flex">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="transition-colors hover:text-[#c85f70]"
              >
                {item.name}
              </Link>
            </li>
          ))}
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
