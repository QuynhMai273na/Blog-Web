"use client";

import { useRouter } from "next/navigation";
import { BLOG_CATEGORIES } from "@/constants/categories";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="w-full animate-bloom bg-[#f6efe9]">
      {/* 1. Phần Intro (Nền trắng) */}
      <section className="w-full bg-white pt-12 pb-20 px-4 md:px-8 border-b border-[#f1ddd8]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center md:items-start gap-16 md:gap-18">
          {/* Avatar dạng hình vòm (Arch shape) với h > w và dải màu gradient */}
          <div className="flex flex-shrink-0 items-center justify-center bg-gradient-to-br from-[#fce8eb] via-[#fdf6f0] to-[#dcefd8] shadow-sm !h-[250px] !w-[200px] rounded-t-[120px] rounded-b-[60px] md:!h-[300px] md:!w-[240px] border border-rose-200">
            <span className="drop-shadow-sm transition-transform duration-500 hover:scale-110 text-[80px] md:text-[100px] leading-none">
              🌸
            </span>
          </div>

          {/* Nội dung Intro */}
          <div className="flex-1 text-center md:text-left mt-4 md:mt-8">
            <h1 className="mb-2 font-serif text-3xl font-normal leading-[1.4] tracking-normal  md:text-[40px] text-text_primary">
              Xin chào, mình là
            </h1>
            <h2 className="mb-6 font-serif text-3xl font-normal leading-[1.4] tracking-normal md:text-[40px] text-[#d96e83]">
              Nguyễn Thị Quỳnh Giang
            </h2>
            <p className="mb-8 text-base font-light leading-relaxed text-[#7a5a55] ">
              Mình là một người phụ nữ 30-, đang trong hành trình học cách làm
              mẹ, chăm sóc bản thân và phát triển từng ngày. Blog này là nơi
              mình ghi lại những điều thật — không hoàn hảo, nhưng là thật.
            </p>

            {/* Các thẻ Tags */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {BLOG_CATEGORIES.map((category) => (
                <span
                  key={category.slug}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium ${category.tagClass}`}
                >
                  {category.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Phần Nội dung chi tiết (Nền Beige) */}
      <div className="w-full pt-12 px-4 md:px-8 pb-4 bg-cream">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Câu chuyện của mình */}
          <section className="rounded-[24px] border border-[#f0e6e0] bg-white p-8 md:p-10 shadow-sm">
            <h3 className="mb-4 font-serif font-normal text-2xl tracking-normal md:text-3xl text-text_primary">
              <span>🌱</span>
              <span className=""> Câu chuyện của mình</span>
            </h3>
            <p className="text-base font-light leading-relaxed text-[#7a5a55]">
              Mình bắt đầu viết blog này vào năm 2024, khi cảm thấy mình đang
              &quot;lạc&quot; trong cuộc sống của chính mình. Vừa làm mẹ, vừa cố gắng giữ
              sức khỏe, vừa lo chuyện tiền bạc — mọi thứ cứ hỗn độn. Blog này là
              nơi mình tìm lại sự cân bằng, và hy vọng những chia sẻ của mình có
              thể đồng hành cùng bạn.
            </p>
          </section>

          {/* Những điều mình tin tưởng */}
          <section className="rounded-[24px] border border-[#f0e6e0] bg-white p-8 md:p-10 shadow-sm">
            <h3 className="mb-6 ml-2 font-serif font-normal text-2xl tracking-normal md:text-3xl text-text_primary">
              <span>💫</span>
              <span className="">Những điều mình tin tưởng</span>
            </h3>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3 px-6">
              <div className="rounded-[20px] border border-rose-200 bg-rose-100/85 p-8 text-center transition-transform hover:-translate-y-1">
                <div className="mb-4 text-3xl">🌸</div>
                <p className="font-serif text-base  text-[#7a5a55] leading-relaxed">
                  Phát triển bản thân không cần phải hoàn hảo
                </p>
              </div>
              <div className="rounded-[20px] border border-rose-200 bg-rose-100/85 p-8 text-center transition-transform hover:-translate-y-1">
                <div className="mb-4 text-3xl">🧘</div>
                <p className="font-serif text-base  text-[#7a5a55] leading-relaxed">
                  Sức khỏe tinh thần quan trọng như thể chất
                </p>
              </div>
              <div className="rounded-[20px] border border-rose-200 bg-rose-100/85 p-8 text-center transition-transform hover:-translate-y-1">
                <div className="mb-4 text-3xl">💌</div>
                <p className="font-serif text-base  text-[#7a5a55] leading-relaxed">
                  Chia sẻ thật lòng tạo kết nối thật sự
                </p>
              </div>
            </div>
          </section>

          {/* Kết nối với mình */}
          <section className="rounded-[24px] border border-[#f0e6e0] bg-white p-10 text-center shadow-sm">
            <h3 className="mb-4 font-serif text-2xl  text-[#3a2520]">
              Kết nối với mình
            </h3>
            <p className="mb-8 text-sm text-[#7a5a55] font-light">
              Nếu bạn muốn trò chuyện, hợp tác hoặc chỉ đơn giản là nói &quot;hi&quot; —
              mình luôn ở đây!
            </p>
            <button
              onClick={() => {
                router.push("/contact");
              }}
              className="rounded-full border border-[#f1ddd8] bg-white px-10 py-3 text-sm font-medium text-[#d96e83] transition-all hover:bg-[#fff5f6] hover:border-[#d96e83]"
            >
              Gửi tin nhắn
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
