import PostCard from "@/components/blog/PostCard";
import Link from "next/link";

const recentPosts = [
  {
    slug: "yoga-me-bau-ngu-ngon",
    title: "5 động tác yoga giúp mẹ bầu ngủ ngon mỗi tối",
    excerpt:
      "Những tư thế nhẹ nhàng cho tam cá nguyệt thứ ba, giúp mình và bé yêu cùng nghỉ ngơi sâu hơn.",
    category: "Yoga" as const,
    date: "15 tháng 4",
    readTime: "5 phút đọc",
  },
  {
    slug: "tiet-kiem-30-phan-tram",
    title: "Tiết kiệm 30% thu nhập mà không cảm thấy thiếu thốn",
    excerpt: "Bí quyết nhỏ sau 2 năm thử nghiệm của mình...",
    category: "Tài chính" as const,
    date: "10 tháng 4",
    readTime: "7 phút đọc",
  },
  {
    slug: "khi-con-khoc",
    title: "Khi con khóc mà mình không hiểu tại sao",
    excerpt: "Hành trình học cách lắng nghe và kết nối với bé yêu của mình.",
    category: "Parenting" as const,
    date: "5 tháng 4",
    readTime: "6 phút đọc",
  },
];

const CATEGORIES = [
  "🌿 Tất cả",
  "👶 Parenting",
  "🧘 Yoga & Sức khỏe",
  "💰 Tài chính cá nhân",
  "🌻 Bài học cuộc sống",
];

export default function HomePage() {
  return (
    <div className="animate-bloom">
      {/* ──────────────────────────────
          HERO
      ────────────────────────────── */}
      <section className="relative overflow-hidden bg-cream px-4 py-16 text-center md:py-20">
        {/* Decorative flowers — left */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-2  top-1/2 hidden -translate-y-1/2 select-none flex-col gap-4 pl-6 opacity-10 sm:flex"
        >
          <span style={{ fontSize: 58 }}>🌸</span>
          <span style={{ fontSize: 32 }}>🌸</span>
        </div>

        {/* Decorative flowers — right */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none flex-col gap-4 pr-6 opacity-10 sm:flex"
        >
          <span style={{ fontSize: 58 }}>🌷</span>
          <span style={{ fontSize: 28 }}>🌸</span>
        </div>

        {/* Eyebrow */}
        <p className="mx-auto mb-5 max-w-[700px] font-serif text-[14px] font-normal italic tracking-[2px] text-[#6c8f7a]">
          — hành trình phát triển bản thân —
        </p>

        {/* Main headline — matching exact typography from screenshot */}
        <h1 className="mx-auto mb-0 max-w-[700px] font-serif text-[40px] font-normal leading-[1.4] tracking-normal text-[#3d2f2f] sm:text-[48px]">
          Chầm chậm{" "}
          <em className="font-medium italic text-[#e58a8a]">lớn lên</em>
          ,<br />
          dịu dàng <em className="font-medium italic text-[#6c8f7a]">nở hoa</em>
        </h1>

        {/* Subline */}
        <p className="mx-auto mt-[15px] max-w-[700px] font-serif text-[16px] italic text-[#8a7f7f]">
          Slowly becoming, beautifully blooming
        </p>
        <p className="mx-auto mt-2.5 max-w-[700px] font-sans text-[13px] tracking-[0.5px] text-[#8a8a8a]">
          Một trang nhật ký về parenting · yoga · tài chính · bài học cuộc sống
        </p>
      </section>

      {/* ──────────────────────────────
          CATEGORY FILTER STRIP
      ────────────────────────────── */}
      <div className="flex flex-wrap justify-center  gap-6 bg-white px-4 py-4 mb-10 border-y border-rose-100 shadow-xs">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat}
            href={i === 0 ? "/posts" : `/posts?cat=${encodeURIComponent(cat)}`}
            className={[
              "rounded-full border text-[12px] font-sans px-4 py-1.5 transition-all",
              i === 0
                ? "border-sage-500 bg-sage-50 text-sage-500 font-medium"
                : "border-rose-100 text-sage-800 hover:border-rose-200 hover:text-sage-800",
            ].join(" ")}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* ──────────────────────────────
          POSTS SECTION
      ────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-5">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2
            className="font-serif text-sage-800 font-bold mb-1"
            style={{ fontSize: "1.75rem" }}
          >
            Bài viết mới nhất
          </h2>
          <p className="font-serif italic text-sage-800/85 text-base">
            những câu chuyện thật, từ cuộc sống thật
          </p>

          {/* Floral divider */}
          <div className="flex items-center justify-center gap-3 mt-3 text-rose-200">
            <span className="block h-px w-8 bg-rose-200" />
            <span className="text-sm select-none">🌸</span>
            <span className="block h-px w-8 bg-rose-200" />
          </div>
        </div>
      </section>
      <section className="w-full mx-auto bg-sand-100 p-8 ">
        {/* Card grid */}
        <div className="items-center justify-center max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 ">
          {recentPosts.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>
      </section>

      {/* ──────────────────────────────
          NEWSLETTER — dark section matching screenshot
      ────────────────────────────── */}
      <section className="bg-light_cream py-12 px-5 text-center mb-8">
        {/* CTA */}
        <div className="text-center mt-10">
          <Link href="/posts" className="btn-primary">
            Xem tất cả bài viết
          </Link>
        </div>
        <h2 className="font-serif text-3xl tracking-[1px] italic text-sage-800/90 font-bold mb-2">
          {/* <p className="mx-auto mb-5 max-w-[700px] font-serif text-[14px] font-normal italic tracking-[2px] text-[#6c8f7a]"> */}
          Cùng mình hành trình mỗi tuần nhé
        </h2>
        <p className="font-serif italic text-sage-800 text-[13px] mb-8">
          Nhận bài viết mới qua email — không spam, chỉ có chuyện thật từ trái
          tim
        </p>

        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="email của bạn..."
            required
            className="flex-1 rounded-xl border border-white/15 bg-[#3a4f3c] px-4 py-3 text-[14px] text-white placeholder-white/35 outline-none focus:border-sage-300 transition-colors"
          />
          <button
            type="submit"
            className="rounded-xl bg-sage-300 px-7 py-3 text-[14px] font-medium text-white transition-all hover:bg-sage-800 whitespace-nowrap"
          >
            Đăng ký
          </button>
        </form>
      </section>
    </div>
  );
}
