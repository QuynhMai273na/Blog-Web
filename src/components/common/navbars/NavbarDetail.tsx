"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"; // Cài đặt: npm install lucide-react

export default function NavbarDetail({ category }: { category?: string }) {
  const router = useRouter();

  return (
    <div className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-rose-100">
      {/* Top Section: Logo & Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-12">
          {/* Logo với phối màu hồng/xanh đặc trưng */}
          <Link
            href="/"
            className="font-serif text-2xl flex items-center gap-2"
          >
            <span className="text-rose-200">Becoming</span>
            <span className="text-sage-300 italic">Blooming</span>
          </Link>

          {/* Nút Quay lại & Links */}
          <div className="hidden md:flex items-center gap-8 text-sage-800/70 font-medium">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 hover:text-sage-300 transition-colors"
            >
              <ArrowLeft size={18} /> Quay lại
            </button>
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

        <button className="px-6 py-2 border border-rose-100 text-rose-200 rounded-xl hover:bg-rose-100 transition-all">
          Đăng nhập
        </button>
      </div>

      {/* Bottom Section: Category Tag (Mô phỏng ảnh image_c12039) */}
      {category && (
        <div className="w-full flex justify-center pb-4">
          <span className="bg-sage-100 text-sage-800 px-4 py-1 rounded-full text-sm font-medium">
            {category}
          </span>
        </div>
      )}
    </div>
  );
}
