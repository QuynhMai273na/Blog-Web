export default function Footer() {
  return (
    <footer className="w-full shrink-0 border-t border-rose-100 bg-cream px-3 py-1.5 shadow-[0_-8px_24px_rgba(45,62,47,0.08)] sm:px-4 sm:py-2">
      <div className="flex items-center justify-center">
        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] font-light leading-5 text-[#a68e8e] sm:hidden">
          <span>© 2026 Becoming Blooming</span>
          <span className="text-sm text-[#ff6b81]">🌸</span>
        </p>

        <p className="hidden flex-wrap items-center justify-center gap-1 text-center text-sm font-light text-[#a68e8e] sm:flex">
          <span>© 2026 Becoming Blooming</span>
          <span className="mx-0.5">·</span>
          <span>Được làm bằng</span>
          <span className="text-base text-[#ff6b81]">🌸</span>
          <span>và nhiều tách trà</span>
        </p>
      </div>
    </footer>
  );
}
