"use client";
import Link from "next/link";

export default function NavbarDetail({ category }: { category?: string }) {
  return (
    <>
      <div className="fixed left-0 top-0 z-50 w-full border-b border-rose-100 bg-white/90 shadow-sm backdrop-blur-md">
        {/* Top Section: Logo & Navigation */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            {/* Logo với phối màu hồng/xanh đặc trưng */}
            <Link
              href="/"
              className="flex items-center gap-2 font-serif text-2xl"
            >
              <span className="text-[#d96e83]">Becoming</span>
              <span className="text-[#6b9b84] italic">Blooming</span>
            </Link>

            {/* Nút Quay lại & Links */}
            <div className="hidden items-center gap-6 font-sans text-base font-medium tracking-[0.01em] text-[#667568] md:flex">
              {/* <button
                onClick={() => router.back()}
                className="flex items-center gap-2 hover:text-sage-300 transition-colors"
              >
                <ArrowLeft size={18} /> Quay lại
              </button> */}
              <Link href="/category/parenting" className="hover:text-rose-200">
                Parenting
              </Link>
              <Link href="/category/yoga" className="hover:text-rose-200">
                Yoga
              </Link>
              <Link href="/category/finance" className="hover:text-rose-200">
                Tài chính
              </Link>
            </div>
          </div>

          <button className="rounded-lg border border-rose-100 px-4 py-1.5 text-sm text-rose-200 transition-all hover:bg-rose-100">
            Đăng nhập
          </button>
        </div>
      </div>
      <div
        className={category ? "h-[50px] shrink-0" : "h-[50px] shrink-0"}
        aria-hidden="true"
      />
    </>
  );
}
