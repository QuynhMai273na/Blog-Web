import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  // Instagram,
  Mail,
  MapPin,
  MessageCircleHeart,
  PencilLine,
} from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";

export const metadata: Metadata = {
  title: "Liên hệ | Becoming Blooming",
  description:
    "Gửi lời nhắn, chia sẻ câu chuyện hoặc kết nối hợp tác cùng Becoming Blooming.",
};

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@becomingblooming.com",
    href: "mailto:hello@becomingblooming.com",
  },
  {
    icon: Globe,
    label: "Website",
    value: "becomingblooming.com",
    href: "https://becomingblooming.com",
  },
  {
    icon: MapPin,
    label: "Địa điểm",
    value: "Hô Chí Minh, Việt Nam",
  },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
];

const topics = [
  "Hợp tác quảng cáo",
  "Góp ý bài viết",
  "Chia sẻ câu chuyện",
  "Lời chào nhẹ nhàng",
];

const topicOptions = topics.map((topic) => ({
  label: topic,
  value: topic,
}));

export default function ContactPage() {
  return (
    <div className="relative isolate px-4 py-10 md:px-6 md:py-14 animate-bloom">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(252,228,230,0.72),transparent_35%),radial-gradient(circle_at_top_right,rgba(209,231,221,0.42),transparent_30%),linear-gradient(180deg,#fcfaf5_0%,#f8f5ed_48%,#fdfbf7_100%)]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-20 -z-10 h-56 w-56 rounded-full bg-rose-100/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-16 right-0 -z-10 h-72 w-72 rounded-full bg-sage-100/50 blur-3xl"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute left-4 top-28 hidden -rotate-12 text-rose-200/25 lg:block"
      >
        <div className="flex items-center gap-3">
          <span className="h-16 w-px rounded-full bg-current" />
          <span className="h-5 w-10 rounded-full border border-current" />
          <span className="h-4 w-8 rounded-full border border-current" />
        </div>
        <div className="ml-7 mt-3 flex items-center gap-3">
          <span className="h-4 w-8 rounded-full border border-current" />
          <span className="h-5 w-10 rounded-full border border-current" />
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-24 right-8 hidden rotate-12 text-sage-300/30 lg:block"
      >
        <div className="flex items-center gap-3">
          <span className="h-20 w-px rounded-full bg-current" />
          <span className="h-5 w-10 rounded-full border border-current" />
          <span className="h-4 w-8 rounded-full border border-current" />
        </div>
        <div className="ml-7 mt-3 flex items-center gap-3">
          <span className="h-4 w-8 rounded-full border border-current" />
          <span className="h-5 w-10 rounded-full border border-current" />
        </div>
      </div>

      <section className="mx-auto max-w-6xl">
        <div className="mb-8 text-center animate-bloom [animation-delay:120ms] [animation-fill-mode:both]">
          <p className="mb-3 font-serif text-[13px]  tracking-[0.2em] text-sage-800/55">
            — contact & kind conversations —
          </p>
          <h1 className="mx-auto max-w-3xl font-serif text-3xl leading-[1.35] tracking-normal text-[#3d2f2f] md:text-[40px]">
            Nếu bạn muốn trò chuyện,
            <span className="block font-medium  text-rose-300">
              mình luôn ở đây lắng nghe
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-7 text-[#7f6e6e] md:text-[15px]">
            Dù là một lời chào, một câu chuyện riêng, góp ý cho bài viết hay lời
            mời hợp tác, mình muốn phần liên hệ này vẫn giữ cảm giác dịu dàng,
            gần gũi và thật như chính blog này.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <aside className="relative overflow-hidden rounded-[36px] border border-white/90 bg-[#fffdfb]/95 p-7 shadow-[0_30px_90px_rgba(45,62,47,0.12),0_10px_30px_rgba(214,156,161,0.12)] ring-1 ring-rose-100/80 backdrop-blur-md animate-bloom [animation-delay:220ms] [animation-fill-mode:both] md:p-10">
            <div
              aria-hidden
              className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-white/80 via-transparent to-rose-50/40"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-rose-50/80 to-transparent"
            />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-[13px] font-medium text-rose-400 shadow-sm">
                <MessageCircleHeart className="h-4 w-4" />
                Một góc nhỏ để kết nối
              </div>

              <h2 className="mt-6 font-serif text-base font-normal  text-[#4a3737] md:text-[36px]">
                Nói chuyện với mình nhé
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-8 text-[#6d5a5a]">
                Mình thích những cuộc trò chuyện chậm rãi, rõ ràng và tử tế. Bạn
                có thể hỏi về nội dung blog, gửi đề xuất hợp tác, hoặc chỉ đơn
                giản là kể cho mình nghe hôm nay của bạn đang nở hoa thế nào.
              </p>

              <div className="mt-8 space-y-4">
                {contactMethods.map(({ icon: Icon, label, value, href }) => {
                  const content = (
                    <div className="group flex items-center gap-4 rounded-[22px] border border-rose-100 bg-white/80 px-4 py-4 shadow-[0_4px_12px_rgba(214,156,161,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(214,156,161,0.18)]">
                      {" "}
                      <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50 text-rose-300 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-sage-800/55">
                          {label}
                        </p>
                        <p className="mt-1 text-[15px] font-semibold text-[#5b4242]">
                          {value}
                        </p>
                      </div>
                    </div>
                  );

                  if (!href) {
                    return <div key={label}>{content}</div>;
                  }

                  return (
                    <Link
                      key={label}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="block rounded-[28px] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>

              <div className="my-8 h-px bg-gradient-to-r from-rose-100 via-rose-200/70 to-transparent" />

              <div className="rounded-[30px] border border-rose-200/80 bg-gradient-to-br from-[#fffdf9] to-[#fff6f7] p-6 shadow-[0_14px_40px_rgba(214,156,161,0.08)]">
                <p className="font-serif text-[17px]  text-[#7f6666]">
                  Mình cũng có mặt ở đây:
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {socials.map((item, index) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-5 py-3 text-[13px] font-semibold text-[#6c5151] shadow-[0_10px_24px_rgba(214,156,161,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-400"
                    >
                      {/* {index === 0 && <Instagram className="h-4 w-4" />} */}
                      {index === 1 && <PencilLine className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="relative overflow-hidden rounded-[36px] border border-white/90 bg-[#fffefd]/95 p-7 shadow-[0_30px_90px_rgba(45,62,47,0.12),0_10px_28px_rgba(168,198,159,0.12)] ring-1 ring-sage-100/80 backdrop-blur-md animate-bloom [animation-delay:320ms] [animation-fill-mode:both] md:p-10">
            <div
              aria-hidden
              className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-white/85 via-transparent to-sage-50/45"
            />
            <div
              aria-hidden
              className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-sage-50"
            />

            <div className="relative">
              <h2 className="font-serif text-base font-normal  text-[#3d2f2f] md:text-[36px]">
                Gửi tin nhắn
              </h2>
              <p className="mt-3 max-w-lg text-[14px] leading-7 text-[#7a6f6f]">
                Điền vài dòng ở đây, mình sẽ đọc thật kỹ và phản hồi khi có thể.
              </p>

              <form className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-[#7f6767]">
                    Tên của bạn
                  </span>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="input-field rounded-[22px] border-rose-200 bg-white px-5 py-4 text-[15px] text-[#5a4545] shadow-[0_8px_24px_rgba(214,156,161,0.08)] placeholder:text-[15px] placeholder:text-[#a88e8e] focus:border-rose-300 focus:ring-rose-200"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-[#7f6767]">
                    Email
                  </span>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="input-field rounded-[22px] border-rose-200 bg-white px-5 py-4 text-[15px] text-[#5a4545] shadow-[0_8px_24px_rgba(214,156,161,0.08)] placeholder:text-[15px] placeholder:text-[#a88e8e] focus:border-rose-300 focus:ring-rose-200"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-[#7f6767]">
                    Chủ đề
                  </span>
                  <CustomSelect name="topic" options={topicOptions} />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold tracking-[0.01em] text-[#7f6767]">
                    Nội dung
                  </span>
                  <textarea
                    rows={6}
                    placeholder="Chia sẻ điều bạn muốn nói với mình..."
                    className="input-field min-h-40 resize-none overflow-hidden rounded-[24px] border-rose-200 bg-white px-5 py-4 text-[15px] text-[#5a4545] shadow-[0_8px_24px_rgba(214,156,161,0.08)] placeholder:font-serif placeholder:text-[15px] placeholder: placeholder:text-[#a88e8e] focus:border-rose-300 focus:ring-rose-200"
                  />
                </label>

                <div className="flex flex-col gap-4 border-t border-rose-100/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xs text-[12px] leading-6 text-sage-800/60">
                    Mình ưu tiên phản hồi các tin nhắn rõ ràng, chân thành và có
                    đủ thông tin liên hệ.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex whitespace-nowrap items-center gap-2 rounded-full bg-[#a8bfa0] px-7 py-3 text-[13px] font-semibold tracking-[0.08em] text-white shadow-[0_4px_14px_rgba(168,191,160,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96b08d] hover:shadow-[0_6px_20px_rgba(168,191,160,0.55)] active:translate-y-0"
                  >
                    Gửi tin nhắn
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
