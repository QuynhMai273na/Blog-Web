export default function PostDetailPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 animate-bloom">
      <header className="mx-auto mb-16 max-w-3xl text-center">
        <span className="tag tag-yoga mb-6 inline-block">Yoga & Sức khỏe</span>
        <h1 className="mb-6 font-serif text-4xl leading-tight text-sage-800 md:text-5xl">
          5 động tác yoga giúp mẹ bầu ngủ ngon hơn mỗi tối
        </h1>
        <div className="text-xs font-medium uppercase tracking-widest text-sage-800/50">
          15 tháng 4, 2026 • 5 phút đọc • 12 bình luận
        </div>
      </header>

      <div className="flex flex-col gap-12 lg:flex-row">
        <article className="flex-1 rounded-4xl border border-rose-50 bg-white p-8 shadow-sm md:p-12">
          <div className="prose prose-sage text-sage-800/80 font-light leading-relaxed lg:prose-lg">
            <p className="mb-6">
              Khi mang thai, giấc ngủ trở thành thứ xa xỉ mà mình chưa từng
              nghĩ mình sẽ thiếu đến vậy. Bụng ngày càng lớn, lưng ngày càng
              mỏi, đêm nào mình cũng trằn trọc mãi...
            </p>

            <blockquote className="my-8 rounded-r-2xl border-l-4 border-rose-200 bg-rose-50/50 p-6 font-serif text-xl italic text-rose-300">
              &quot;Yoga không phải để bạn hoàn hảo hơn, mà là để bạn cảm
              thấy nhẹ nhàng hơn với chính mình.&quot;
            </blockquote>

            <h3 className="mb-4 mt-10 font-serif text-2xl text-sage-800">
              1. Tư thế con mèo - con bò
            </h3>
            <p className="mb-6">
              Tư thế này giúp thư giãn cơ lưng dưới và cải thiện tuần hoàn.
              Thực hiện nhẹ nhàng, hít thở đều theo từng động tác, khoảng 8-10
              lần mỗi tối.
            </p>

            <h3 className="mb-4 mt-10 font-serif text-2xl text-sage-800">
              2. Tư thế trẻ em
            </h3>
            <p className="mb-6">
              Mở rộng hai đầu gối ra để nhường chỗ cho bụng bầu. Đây là tư thế
              mình yêu thích nhất, cảm giác được thả lỏng hoàn toàn rất rõ ràng
              và dễ chịu.
            </p>
          </div>

          <hr className="my-12 border-rose-100/50" />

          <section>
            <h3 className="mb-8 font-serif text-2xl italic text-sage-800">
              Bình luận (12)
            </h3>
            <div className="mb-10 space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-200">
                  🌸
                </div>
                <div>
                  <h4 className="text-sm font-bold text-sage-800">
                    Nguyễn Thảo Linh
                  </h4>
                  <p className="mt-1 text-sm italic text-sage-800/70">
                    Mình thử tư thế số 2 và ngủ ngon hơn hẳn từ tuần trước!
                    Cảm ơn bạn nhiều nha...
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mt-8 rounded-3xl border border-rose-100 bg-white p-6 shadow-sm">
              <textarea
                placeholder="Chia sẻ cảm nghĩ của bạn..."
                className="h-24 w-full resize-none bg-transparent text-sm text-sage-800 outline-none placeholder:text-sage-800/40"
              />
              <button className="absolute -bottom-5 left-6 rounded-full border border-rose-100 bg-white px-6 py-2 text-sm text-sage-800 shadow-sm">
                Gửi bình luận
              </button>
            </div>
          </section>
        </article>

        <aside className="w-full space-y-8 lg:w-80">
          <div className="rounded-4xl border border-rose-50 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-3xl text-rose-200">
              🌸
            </div>
            <h3 className="font-serif text-xl font-bold text-sage-800">
              Becoming Blooming
            </h3>
            <p className="mb-6 mt-2 text-xs italic leading-relaxed text-sage-800/60">
              Người mẹ đang học cách sống chậm, sống đẹp và phát triển từng
              ngày.
            </p>
            <button className="w-full rounded-xl border border-sage-100 py-2 text-sm text-sage-300 transition-colors hover:bg-sage-50">
              Theo dõi
            </button>
          </div>

          <div className="rounded-4xl border border-rose-50 bg-white p-8 shadow-sm">
            <h3 className="mb-4 border-b border-rose-100 pb-2 font-serif text-lg text-sage-800">
              Bài viết liên quan
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-sm italic text-sage-800/80 transition-colors hover:text-rose-200"
                >
                  Nhật ký 30 ngày uống đủ nước, điều gì thay đổi?
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm italic text-sage-800/80 transition-colors hover:text-rose-200"
                >
                  Cách giữ thói quen tập yoga khi bận con nhỏ
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
