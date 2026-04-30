export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 animate-bloom">
      <section className="mb-16 flex flex-col items-center gap-10 rounded-[40px] border border-rose-50 bg-white p-8 shadow-sm md:flex-row md:gap-16 md:p-12">
        <div className="flex h-48 w-48 flex-shrink-0 items-center justify-center rounded-full border-4 border-white bg-rose-50 shadow-lg md:h-64 md:w-64">
          <span className="text-7xl">🌸</span>
        </div>
        <div>
          <h1 className="mb-2 font-serif text-3xl text-sage-800 md:text-5xl">
            Xin chào, mình là
          </h1>
          <h2 className="mb-6 font-serif text-4xl italic text-rose-200 md:text-6xl">
            Becoming Blooming
          </h2>
          <p className="mb-6 text-sm font-light leading-relaxed text-sage-800/70">
            Mình là một người phụ nữ 30+, đang trong hành trình học cách làm
            mẹ, chăm sóc bản thân và phát triển từng ngày. Blog này là nơi mình
            ghi lại những điều thật, không hoàn hảo, nhưng là thật.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="tag tag-parenting">Parenting</span>
            <span className="tag tag-yoga">Yoga</span>
            <span className="tag tag-finance">Tài chính</span>
          </div>
        </div>
      </section>

      <section className="mb-10 rounded-[32px] border border-rose-50 bg-white p-10 shadow-sm">
        <h3 className="mb-4 font-serif text-2xl italic text-sage-800">
          Câu chuyện của mình
        </h3>
        <p className="text-sm font-light leading-relaxed text-sage-800/70">
          Mình bắt đầu viết blog này vào năm 2024, khi cảm thấy mình đang
          &quot;lạc&quot; trong cuộc sống của chính mình. Vừa làm mẹ, vừa cố
          gắng giữ sức khỏe, vừa lo chuyện tiền bạc, mọi thứ cứ hỗn độn. Blog
          này là nơi mình tìm lại sự cân bằng, và hy vọng những chia sẻ của
          mình có thể đồng hành cùng bạn.
        </p>
      </section>

      <section className="mb-10">
        <h3 className="mb-6 ml-2 font-serif text-2xl italic text-sage-800">
          Những điều mình tin tưởng
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-rose-100 bg-rose-50/50 p-8 text-center">
            <div className="mb-3 text-3xl">🌸</div>
            <p className="font-serif text-sm italic text-sage-800/80">
              Phát triển bản thân không cần phải hoàn hảo
            </p>
          </div>
          <div className="rounded-3xl border border-rose-100 bg-rose-50/50 p-8 text-center">
            <div className="mb-3 text-3xl">🧘</div>
            <p className="font-serif text-sm italic text-sage-800/80">
              Sức khỏe tinh thần quan trọng như thể chất
            </p>
          </div>
          <div className="rounded-3xl border border-rose-100 bg-rose-50/50 p-8 text-center">
            <div className="mb-3 text-3xl">💌</div>
            <p className="font-serif text-sm italic text-sage-800/80">
              Chia sẻ thật lòng tạo kết nối thật sự
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-rose-50 bg-white p-10 text-center shadow-sm">
        <h3 className="mb-4 font-serif text-2xl italic text-sage-800">
          Kết nối với mình
        </h3>
        <p className="mb-6 text-sm text-sage-800/60">
          Nếu bạn muốn trò chuyện, hợp tác hoặc chỉ đơn giản là nói
          &quot;hi&quot;, mình luôn ở đây!
        </p>
        <button className="rounded-full border border-rose-100 px-8 py-3 text-sm font-medium text-rose-200 transition-colors hover:bg-rose-50">
          Gửi tin nhắn
        </button>
      </section>
    </div>
  );
}
