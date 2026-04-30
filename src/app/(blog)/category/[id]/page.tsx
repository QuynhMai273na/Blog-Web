// export default async function CategoryPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   const categoryName = decodeURIComponent(id);

//   return (
//     <div className="mx-auto max-w-4xl px-6 py-12 animate-bloom">
//       <header className="mb-12 border-b border-rose-100 pb-8">
//         <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-sage-300">
//           Chủ đề
//         </p>
//         <h1 className="mb-3 font-serif text-5xl text-sage-800">
//           {categoryName}
//         </h1>
//         <p className="text-sm text-sage-800/60">
//           Các bài viết thuộc chủ đề này sẽ được hiển thị tại đây.
//         </p>
//       </header>

//       <div className="rounded-3xl border border-rose-100 bg-white p-8 text-center text-sm text-sage-800/60 shadow-sm">
//         Chưa có bài viết trong chủ đề này.
//       </div>
//     </div>
//   );
// }
import Link from "next/link";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryName = decodeURIComponent(id);

  // Fake data để test giao diện.
  // (Đổi thành [] để xem giao diện khi không có bài viết)
  const fakePosts = [
    {
      title: `Bài viết mẫu tuyệt hay cho chủ đề ${categoryName}`,
      excerpt:
        "Một đoạn trích dẫn ngắn gọn giúp người đọc nắm bắt được nội dung chính của bài viết trước khi click vào xem chi tiết...",
      category: categoryName,
      date: "20 tháng 4",
      readTime: "5 phút đọc",
      comments: 12,
      icon: "🌸",
      imgBg: "bg-[#fce8eb]",
      tagStyle: "bg-sage-100 text-sage-500 border border-sage-300",
      rowBg: "bg-white",
    },
    {
      title: `Hành trình khám phá những điều mới mẻ từ ${categoryName}`,
      excerpt:
        "Bí quyết nhỏ nhưng mang lại hiệu quả bất ngờ sau thời gian dài thử nghiệm của bản thân mình...",
      category: categoryName,
      date: "18 tháng 4",
      readTime: "7 phút đọc",
      comments: 8,
      icon: "🌿",
      imgBg: "bg-[#dcefd8]",
      tagStyle: "bg-sand-100 text-sand-500 border border-sand-300",
      rowBg: "bg-white",
    },
    {
      title: "Ghi chép nhỏ: Bài học đắt giá nhất mình từng học được",
      excerpt:
        "Không phải mọi thứ đều suôn sẻ — và đôi khi những vấp ngã lại chính là cơ hội tốt nhất để chúng ta...",
      category: categoryName,
      date: "15 tháng 4",
      readTime: "6 phút đọc",
      comments: 15,
      icon: "🌻",
      imgBg: "bg-[#f9f2ee]",
      tagStyle: "bg-rose-100 text-rose-500 border border-rose-400",
      rowBg: "bg-[#fff5f6]", // Nền hồng nhạt nhấn mạnh
    },
  ];

  return (
    <div className="w-full animate-bloom bg-white flex flex-col min-h-screen pb-4">
      {/* 1. Header Section (Nền hồng nhạt tràn viền) */}
      <section className="w-full bg-[#fff5f6] py-10 px-6 border-b border-[#f1ddd8]">
        <div className="text-center mx-auto max-w-5xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-sage-300">
            Chủ đề
          </p>
          <h1 className="text-3xl md:text-4xl italic font-serif text-sage-800 mb-4 tracking-[0.02rem]">
            {categoryName}
          </h1>
          <p className="text-sage-800/85 text-base italic font-serif font-light">
            Các bài viết thuộc chủ đề này sẽ được hiển thị tại đây.
          </p>
        </div>
      </section>

      {/* 2. Danh sách bài viết hoặc Trạng thái trống */}
      {fakePosts.length > 0 ? (
        <>
          <section className="w-full flex-1 flex flex-col">
            {fakePosts.map((post, idx) => (
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
                      {post.date} <span className="mx-2">•</span>{" "}
                      {post.readTime} <span className="mx-2">•</span>{" "}
                      {post.comments} bình luận
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* 3. Phân trang (Chỉ hiển thị nếu có bài viết) */}
          <section className="w-full bg-[#fdfcf8] py-10">
            <div className="flex justify-center items-center gap-3">
              <button className="px-5 py-2.5 rounded-full border border-[#f1ddd8] bg-white text-sage-800 text-sm font-medium hover:bg-[#fff5f6] hover:text-[#d96e83] transition-colors shadow-sm">
                ← Trước
              </button>

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
        </>
      ) : (
        /* Trạng thái khi KHÔNG có bài viết */
        <section className="w-full flex-1 flex items-center justify-center py-10 px-6">
          <div className="rounded-3xl border border-rose-100 bg-[#fdfcf8] p-10 text-center shadow-sm w-full max-w-2xl">
            <div className="text-4xl mb-4 opacity-50">🍃</div>
            <h3 className="font-serif text-xl text-sage-800 mb-2">
              Chưa có bài viết nào
            </h3>
            <p className="text-sm text-sage-800/60">
              Hiện tại chủ đề <strong>{categoryName}</strong> chưa có bài viết
              nào. Bạn hãy quay lại sau nhé!
            </p>
            <div className="mt-8">
              <Link
                href="/posts"
                className="rounded-full bg-[#d96e83] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#c85f70]"
              >
                Xem tất cả bài viết
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
