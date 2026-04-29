import Link from "next/link";

export default function NavbarMain() {
  const menuItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Parenting", href: "/category/parenting" },
    { name: "Yoga & Sức khỏe", href: "/category/yoga" },
    { name: "Tài chính", href: "/category/finance" },
    { name: "Cuộc sống", href: "/category/life" },
    { name: "Đăng nhập", href: "/login" },
  ];

  return (
    <nav className="w-full bg-white px-8 py-6 flex justify-between items-center sticky top-0 z-50">
      <div className="font-serif text-2xl">
        <span className="text-rose-200">Becoming</span>{" "}
        <span className="text-sage-300 italic">Blooming</span>
      </div>

      <ul className="hidden md:flex gap-10 text-sage-800/80">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="hover:text-rose-200 transition-colors font-medium"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <button className="px-6 py-2 border border-rose-100 text-rose-200 rounded-xl">
        Đăng nhập
      </button>
    </nav>
  );
}
