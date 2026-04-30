// import PostCard from "@/components/blog/PostCard";
// import Link from "next/link";

// export default function HomePage() {
//   const recentPosts = [
//     {
//       title: "5 động tác yoga giúp mẹ bầu ngủ ngon mỗi tối",
//       excerpt: "Những tư thế nhẹ nhàng cho tam cá nguyệt thứ ba...",
//       category: "Yoga" as const,
//       date: "15 tháng 4",
//       readTime: "5 phút đọc",
//     },
//     {
//       title: "Tiết kiệm 30% thu nhập mà không cảm thấy thiếu thốn",
//       excerpt: "Bí quyết nhỏ sau 2 năm thử nghiệm của mình...",
//       category: "Tài chính" as const,
//       date: "10 tháng 4",
//       readTime: "7 phút đọc",
//     },
//     {
//       title: "Khi con khóc mà mình không hiểu tại sao",
//       excerpt: "Hành trình học cách lắng nghe và kết nối với bé...",
//       category: "Parenting" as const,
//       date: "5 tháng 4",
//       readTime: "6 phút đọc",
//     },
//   ];

//   return (
//     <div className="px-4 py-12 md:py-20 animate-bloom">
//       {/* Hero Section */}
//       <section className="text-center max-w-3xl mx-auto mb-20">
//         <p className="text-sage-300 uppercase tracking-[0.3em] text-xs font-bold mb-6">
//           — hành trình phát triển bản thân —
//         </p>
//         <h1 className="text-5xl md:text-7xl font-serif text-sage-800 leading-tight mb-4">
//           Chậm chậm <span className="text-rose-200 italic">lớn lên</span>,<br />
//           dịu dàng <span className="text-sage-300 italic">nở hoa</span>
//         </h1>
//         <p className="text-sage-800/60 font-serif italic mb-2">
//           Slowly becoming, beautifully blooming
//         </p>
//         <p className="text-sm text-sage-800/50">
//           Một trang nhật ký về parenting · yoga · tài chính · bài học cuộc sống
//         </p>
//       </section>

//       {/* Bài viết mới nhất */}
//       <section className="max-w-6xl mx-auto mb-24">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-serif text-sage-800 mb-2">
//             Bài viết mới nhất
//           </h2>
//           <p className="text-sage-800/50 italic text-sm">
//             những câu chuyện thật, từ cuộc sống thật
//           </p>
//           <div className="flex justify-center items-center gap-4 mt-4 text-rose-200">
//             <span className="w-8 h-[1px] bg-rose-200"></span> 🌸{" "}
//             <span className="w-8 h-[1px] bg-rose-200"></span>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {recentPosts.map((post, index) => (
//             <PostCard key={index} {...post} />
//           ))}
//         </div>
//         <div className="text-center mt-12">
//           <Link href="/posts" className="btn-primary inline-block">
//             Xem tất cả bài viết
//           </Link>
//         </div>
//       </section>

//       {/* Newsletter Section */}
//       <section className="max-w-3xl mx-auto bg-white p-12 rounded-[40px] border border-rose-100/50 text-center shadow-sm">
//         <h2 className="text-2xl font-serif text-sage-800 mb-3">
//           Cùng mình hành trình mỗi tuần nhé
//         </h2>
//         <p className="text-sage-800/60 italic text-sm mb-8">
//           Nhận bài viết mới qua email — không spam, chỉ có chuyện thật từ trái
//           tim
//         </p>
//         <form className="flex flex-col md:flex-row gap-4">
//           <input
//             type="email"
//             placeholder="Email của bạn..."
//             className="input-field flex-1 bg-gray-50 border-transparent focus:border-rose-200 focus:bg-white"
//           />
//           <button type="submit" className="btn-primary md:w-auto w-full">
//             Đăng ký
//           </button>
//         </form>
//       </section>
//     </div>
//   );
// }

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
  "Tất cả",
  "Parenting",
  "Yoga & Sức khỏe",
  "Tài chính cá nhân",
  "Bài học cuộc sống",
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
      <div className="flex flex-wrap justify-center  gap-6 bg-white px-4 py-4 mb-12 border-y border-rose-100 shadow-xs">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat}
            href={i === 0 ? "/blog" : `/blog?cat=${encodeURIComponent(cat)}`}
            className={[
              "rounded-full border text-[12px] font-sans px-4 py-1.5 transition-all",
              i === 0
                ? "border-sage-800 bg-cream text-sage-800 font-medium"
                : "border-rose-100 text-sage-800/65 hover:border-rose-200 hover:text-sage-800",
            ].join(" ")}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* ──────────────────────────────
          POSTS SECTION
      ────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-5 pb-20">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2
            className="font-serif text-sage-800 font-bold mb-1"
            style={{ fontSize: "1.75rem" }}
          >
            Bài viết mới nhất
          </h2>
          <p className="font-serif italic text-sage-800/45 text-[13px]">
            những câu chuyện thật, từ cuộc sống thật
          </p>

          {/* Floral divider */}
          <div className="flex items-center justify-center gap-3 mt-3 text-rose-200">
            <span className="block h-px w-8 bg-rose-200" />
            <span className="text-sm select-none">🌸</span>
            <span className="block h-px w-8 bg-rose-200" />
          </div>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link href="/blog" className="btn-primary">
            Xem tất cả bài viết
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────
          NEWSLETTER — dark section matching screenshot
      ────────────────────────────── */}
      <section className="bg-[#2d3e2f] py-16 px-5 text-center">
        <h2
          className="font-serif text-white font-bold mb-2"
          style={{ fontSize: "1.55rem" }}
        >
          Cùng mình hành trình mỗi tuần nhé
        </h2>
        <p className="font-serif italic text-white/50 text-[13px] mb-8">
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
