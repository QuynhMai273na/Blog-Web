import PostCard from "@/components/blog/PostCard";
import Link from "next/link";

export default function HomePage() {
  const recentPosts = [
    {
      title: "5 động tác yoga giúp mẹ bầu ngủ ngon mỗi tối",
      excerpt: "Những tư thế nhẹ nhàng cho tam cá nguyệt thứ ba...",
      category: "Yoga" as const,
      date: "15 tháng 4",
      readTime: "5 phút đọc",
    },
    {
      title: "Tiết kiệm 30% thu nhập mà không cảm thấy thiếu thốn",
      excerpt: "Bí quyết nhỏ sau 2 năm thử nghiệm của mình...",
      category: "Tài chính" as const,
      date: "10 tháng 4",
      readTime: "7 phút đọc",
    },
    {
      title: "Khi con khóc mà mình không hiểu tại sao",
      excerpt: "Hành trình học cách lắng nghe và kết nối với bé...",
      category: "Parenting" as const,
      date: "5 tháng 4",
      readTime: "6 phút đọc",
    },
  ];

  return (
    <div className="px-4 py-12 md:py-20 animate-bloom">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-20">
        <p className="text-sage-300 uppercase tracking-[0.3em] text-xs font-bold mb-6">
          — hành trình phát triển bản thân —
        </p>
        <h1 className="text-5xl md:text-7xl font-serif text-sage-800 leading-tight mb-4">
          Chậm chậm <span className="text-rose-200 italic">lớn lên</span>,<br />
          dịu dàng <span className="text-sage-300 italic">nở hoa</span>
        </h1>
        <p className="text-sage-800/60 font-serif italic mb-2">
          Slowly becoming, beautifully blooming
        </p>
        <p className="text-sm text-sage-800/50">
          Một trang nhật ký về parenting · yoga · tài chính · bài học cuộc sống
        </p>
      </section>

      {/* Bài viết mới nhất */}
      <section className="max-w-6xl mx-auto mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-sage-800 mb-2">
            Bài viết mới nhất
          </h2>
          <p className="text-sage-800/50 italic text-sm">
            những câu chuyện thật, từ cuộc sống thật
          </p>
          <div className="flex justify-center items-center gap-4 mt-4 text-rose-200">
            <span className="w-8 h-[1px] bg-rose-200"></span> 🌸{" "}
            <span className="w-8 h-[1px] bg-rose-200"></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts.map((post, index) => (
            <PostCard key={index} {...post} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/posts" className="btn-primary inline-block">
            Xem tất cả bài viết
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-3xl mx-auto bg-white p-12 rounded-[40px] border border-rose-100/50 text-center shadow-sm">
        <h2 className="text-2xl font-serif text-sage-800 mb-3">
          Cùng mình hành trình mỗi tuần nhé
        </h2>
        <p className="text-sage-800/60 italic text-sm mb-8">
          Nhận bài viết mới qua email — không spam, chỉ có chuyện thật từ trái
          tim
        </p>
        <form className="flex flex-col md:flex-row gap-4">
          <input
            type="email"
            placeholder="Email của bạn..."
            className="input-field flex-1 bg-gray-50 border-transparent focus:border-rose-200 focus:bg-white"
          />
          <button type="submit" className="btn-primary md:w-auto w-full">
            Đăng ký
          </button>
        </form>
      </section>
    </div>
  );
}
