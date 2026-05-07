import PostCard from "@/components/blog/PostCard";
import {
  BLOG_CATEGORY_SLUGS,
  type BlogCategorySlug,
} from "@/constants/categories";
import Link from "next/link";
import {
  getCategoryOptions,
  getLatestPostsByCategorySlugs,
  getPublishedPosts,
} from "@/services/post.service";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams?: Promise<{ cat?: string }>;
};

function isBlogCategorySlug(value: string): value is BlogCategorySlug {
  return BLOG_CATEGORY_SLUGS.includes(value as BlogCategorySlug);
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const categorySlug =
    params?.cat && isBlogCategorySlug(params.cat)
      ? params.cat
      : undefined;
  const [recentPosts, categories] = await Promise.all([
    categorySlug
      ? getPublishedPosts({ categorySlug, limit: 4 })
      : getLatestPostsByCategorySlugs(BLOG_CATEGORY_SLUGS),
    getCategoryOptions(),
  ]);

  return (
    <div className="animate-bloom">
      <section className="relative overflow-hidden bg-cream px-4 py-16 text-center md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute left-2 top-1/2 hidden -translate-y-1/2 select-none flex-col gap-4 pl-6 opacity-10 sm:flex"
        >
          <span style={{ fontSize: 58 }}>🌸</span>
          <span style={{ fontSize: 32 }}>🌸</span>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none flex-col gap-4 pr-6 opacity-10 sm:flex"
        >
          <span style={{ fontSize: 58 }}>🌷</span>
          <span style={{ fontSize: 28 }}>🌸</span>
        </div>

        <h1 className="mx-auto mb-0 max-w-[700px] font-serif text-[40px] font-normal leading-[1.4] tracking-normal text-[#3d2f2f] sm:text-[48px]">
          Chầm chậm{" "}
          <em className="font-medium not-italic text-[#e58a8a]">lớn lên</em>
          ,<br />
          dịu dàng{" "}
          <em className="font-medium not-italic text-[#6c8f7a]">nở hoa</em>
        </h1>

        <p className="mx-auto mt-[15px] max-w-[700px] font-serif text-[25px] italic text-[#8a7f7f]">
          Slowly becoming, beautifully blooming
        </p>
        <p className="mx-auto mt-2.5 max-w-[700px] font-sans text-base tracking-[0.5px] text-[#8a8a8a]">
          Một trang nhật ký về yoga · parenting ·  tài chính cá nhân · cuộc sống
        </p>
      </section>

      <div className="mb-10 flex flex-wrap justify-center gap-6 border-y border-rose-100 bg-white px-4 py-4 shadow-xs">
        <Link
          // href="/#latest-posts"
          href="/"
          scroll={false}
          className={[
            "rounded-full border px-4 py-1.5 font-sans text-[12px] transition-all",
            !categorySlug
              ? "border-sage-500 bg-sage-50 font-medium text-sage-500"
              : "border-rose-100 text-sage-800 hover:border-rose-200 hover:text-sage-800",
          ].join(" ")}
        >
          🌿 Tất cả
        </Link>
        {categories.map((category) => (
          <Link
            key={category.value}
            // href={`/?cat=${category.value}#latest-posts`}
            href={`/?cat=${category.value}`}
            scroll={false}
            className={[
              "rounded-full border px-4 py-1.5 font-sans text-[12px] transition-all",
              categorySlug === category.value
                ? "border-sage-500 bg-sage-50 font-medium text-sage-500"
                : "border-rose-100 text-sage-800 hover:border-rose-200 hover:text-sage-800",
            ].join(" ")}
          >
            {category.label}
          </Link>
        ))}
      </div>

      <section className="mx-auto max-w-5xl px-5">
        <div className="mb-8 text-center">
          <h2
            className="mb-1 font-serif font-bold text-sage-800"
            style={{ fontSize: "1.75rem" }}
          >
            Bài viết mới nhất
          </h2>
          <p className="font-serif text-base  text-sage-800/85">
            những câu chuyện thật, từ cuộc sống thật
          </p>

          <div className="mt-3 flex items-center justify-center gap-3 text-rose-200">
            <span className="block h-px w-8 bg-rose-200" />
            <span className="select-none text-sm">🌸</span>
            <span className="block h-px w-8 bg-rose-200" />
          </div>
        </div>
      </section>

      <section id="latest-posts" className="mx-auto w-full bg-sand-100 p-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center justify-center gap-8 sm:grid-cols-2 md:grid-cols-4">
          {recentPosts.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>
      </section>

      <section className="bg-light_cream px-6 py-12 text-center">
        <div className="mb-12 mt-2 text-center">
          <Link href="/posts" className="btn-primary">
            Xem tất cả bài viết
          </Link>
        </div>
        <h2 className="my-2 font-serif text-3xl font-bold  tracking-[1px] text-sage-800/90">
          Cùng mình đi qua hành trình mỗi tuần nhé
        </h2>
        <p className="mb-8 font-serif text-[13px]  text-sage-800">
          Nhận bài viết mới qua email - không spam, chỉ có chuyện thật từ trái
          tim
        </p>

        <form className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="email của bạn..."
            required
            className="flex-1 rounded-xl border border-white/15 bg-[#3a4f3c] px-4 py-3 text-[14px] text-white outline-none transition-colors placeholder:text-white/35 focus:border-sage-300"
          />
          <button
            type="submit"
            className="whitespace-nowrap rounded-xl bg-sage-300 px-7 py-3 text-[14px] font-medium text-white transition-all hover:bg-sage-800"
          >
            Đăng ký
          </button>
        </form>
      </section>
    </div>
  );
}
