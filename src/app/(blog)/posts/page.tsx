import Link from "next/link";

export default function PostsPage() {
  // Dữ liệu mẫu mô phỏng chính xác 5 bài viết trong ảnh thiết kế
  const posts = [
    {
      title: "5 động tác yoga giúp mẹ bầu ngủ ngon hơn",
      excerpt:
        "Những tư thế nhẹ nhàng phù hợp cho tam cá nguyệt thứ ba, thử ngay tối nay...",
      category: "Yoga",
      date: "15 tháng 4",
      readTime: "5 phút đọc",
      comments: 12,
      icon: "🧘",
      imgBg: "bg-[#fce8eb]",
      tagStyle: "bg-sage-100 text-sage-500 border border-sage-300",
      rowBg: "bg-white",
    },
    {
      title: "Cách mình tiết kiệm 30% thu nhập mà không cảm thấy thiếu thốn",
      excerpt: "Bí quyết nhỏ nhưng hiệu quả sau 2 năm thử nghiệm của mình...",
      category: "Tài chính",
      date: "10 tháng 4",
      readTime: "7 phút đọc",
      comments: 8,
      icon: "💰",
      imgBg: "bg-[#dcefd8]",
      tagStyle: "bg-sand-100 text-sand-500 border border-sand-300",
      rowBg: "bg-white",
    },
    {
      title: "Khi con khóc mà mình không biết tại sao",
      excerpt:
        "Hành trình học cách lắng nghe và kết nối với bé yêu của mình...",
      category: "Parenting",
      date: "5 tháng 4",
      readTime: "6 phút đọc",
      comments: 15,
      icon: "👶",
      imgBg: "bg-[#fce8eb]",
      tagStyle: "bg-rose-100 text-rose-500 border border-rose-400",
      rowBg: "bg-[#fff5f6]", // Nền hồng nhạt nhấn mạnh toàn bộ dải ngang
    },
    {
      title: "Nhật ký 30 ngày uống đủ nước — điều gì đã thay đổi?",
      excerpt:
        "Kết quả bất ngờ sau một tháng kiên trì với thói quen nhỏ này...",
      category: "Sức khỏe",
      date: "1 tháng 4",
      readTime: "4 phút đọc",
      comments: 5,
      icon: "🌿",
      imgBg: "bg-[#e5f0f5]",
      tagStyle: "bg-sage-100 text-sage-500 border border-sage-300",
      rowBg: "bg-white",
    },
    {
      title: "Bài học mình học được từ việc thất bại nhiều lần",
      excerpt: "Không phải mọi thứ đều suôn sẻ — và đó là điều tốt...",
      category: "Cuộc sống",
      date: "28 tháng 3",
      readTime: "8 phút đọc",
      comments: 20,
      icon: "🌻",
      imgBg: "bg-[#f9f2ee]",
      tagStyle: "bg-sand-100 text-sand-500 border border-sand-300",
      rowBg: "bg-white",
    },
  ];

  return (
    <div className="w-full animate-bloom bg-white flex flex-col min-h-screen pb-4">
      {/* 1. Header Section (Nền hồng nhạt tràn viền) */}
      <section className="w-full bg-[#fff5f6] py-10 px-6 border-b border-[#f1ddd8]">
        <div className=" text-center mx-auto max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl italic font-serif text-sage-800 mb-3 tracking-[0.02rem]">
            Tất cả bài viết
          </h1>
          <p className="text-sage-800/85 text-base italic font-serif font-light">
            những câu chuyện từ hành trình phát triển bản thân của mình
          </p>
        </div>
      </section>

      {/* 2. Filter / Search Bar */}
      <section className="w-full border-b border-[#f1ddd8] py-4 px-6">
        <div className="max-w-5xl mx-auto flex gap-4 items-center">
          {/* Nút màu đen xám (Placeholder cho icon bộ lọc/tìm kiếm) */}
          <div className="w-12 h-12 bg-[#333333] rounded-xl flex-shrink-0 shadow-sm" />

          {/* Dropdown Select bo tròn hai đầu */}
          <div className="relative flex-1 max-w-full">
            <select className="w-full appearance-none rounded-full border border-[#f1ddd8] bg-white py-3 pl-6 pr-12 text-sm text-sage-800 outline-none hover:border-[#d96e83] transition-colors cursor-pointer">
              <option>Tất cả chủ đề</option>
              <option>Parenting</option>
              <option>Yoga</option>
              <option>Tài chính</option>
            </select>
            {/* Custom Arrow Down */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-sage-800">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Danh sách bài viết (Layout ngang - Flat List) */}
      <section className="w-full flex-1 flex flex-col">
        {posts.map((post, idx) => (
          <div
            key={idx}
            className={`w-full border-b border-[#f1ddd8] transition-colors hover:bg-[#fffcfd] ${post.rowBg}`}
          >
            <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-10 md:items-center">
              {/* Ảnh Thumbnail bo tròn góc */}
              <div
                className={`w-full md:w-[160px] h-[110px] flex-shrink-0 rounded-[14px] flex items-center justify-center text-[40px] shadow-sm ${post.imgBg} border border-rose-200 transition-transform hover:scale-105 cursor-pointer`}
              >
                <span className="transition-transform duration-300 hover:scale-110 cursor-pointer">
                  {post.icon}
                </span>
              </div>

              {/* Nội dung Text */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${post.tagStyle}`}
                  >
                    {post.category}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-sage-800 mb-2 cursor-pointer hover:text-[#d96e83] transition-colors tracking-[0.02rem] line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sage-800/85 text-base font-light line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
                <div className="text-xs text-sage-800/85 font-light uppercase tracking-[0.02rem]">
                  {post.date} <span className="mx-2">•</span> {post.readTime}{" "}
                  <span className="mx-2">•</span> {post.comments} bình luận
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 4. Phân trang (Pagination - Nền kem nhạt dưới đáy) */}
      <section className="w-full bg-[#fdfcf8] py-10">
        <div className="flex justify-center items-center gap-3">
          <button className="px-5 py-2.5 rounded-full border border-[#f1ddd8] bg-white text-sage-800 text-sm font-medium hover:bg-[#fff5f6] hover:text-[#d96e83] transition-colors shadow-sm">
            ← Trước
          </button>

          {/* Nút trang hiện tại (Active) */}
          <button className="w-10 h-10 rounded-full bg-[#d96e83] text-white text-sm font-bold shadow-md hover:bg-[#c85f70] transition-colors">
            1
          </button>

          <button className="w-10 h-10 rounded-full border border-[#f1ddd8] bg-white text-sage-800 text-sm font-medium hover:bg-[#fff5f6] hover:text-[#d96e83] transition-colors shadow-sm">
            2
          </button>

          <button className="px-5 py-2.5 rounded-full border border-[#f1ddd8] bg-white text-sage-800 text-sm font-medium hover:bg-[#fff5f6] hover:text-[#d96e83] transition-colors shadow-sm">
            Sau →
          </button>
        </div>
      </section>
    </div>
  );
}
