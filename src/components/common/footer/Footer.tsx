export default function Footer() {
  return (
    <>
      <footer className="fixed bottom-0 left-0 z-50 w-full border-t border-rose-100 bg-cream px-4 py-2 shadow-[0_-8px_24px_rgba(45,62,47,0.08)]">
        <div className="flex items-center justify-center">
          <p className="flex flex-wrap items-center justify-center gap-1 text-center text-sm font-light text-[#a68e8e]">
            <span>© 2026 Becoming Blooming</span>
            <span className="mx-0.5">·</span>
            <span>Được làm bằng</span>
            <span className="text-base text-[#ff6b81]">🌸</span>
            <span>và nhiều tách trà</span>
          </p>
        </div>
      </footer>
    </>
  );
}
