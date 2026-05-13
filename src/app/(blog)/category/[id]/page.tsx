import Link from "next/link";
import { Search } from "lucide-react";
import { getBlogCategoryLabel } from "@/constants/categories";
import { Pagination } from "@/components/ui/Pagination";
import { getPublishedPosts } from "@/services/post.service";

export const dynamic = "force-dynamic";
const POSTS_PER_PAGE = 4;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ page?: string; q?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const searchQuery = query?.q?.trim() ?? "";
  const requestedPage = Number(query?.page ?? "1");
  const allPosts = await getPublishedPosts({
    categorySlug: id,
    orderBy: "created_at",
    query: searchQuery,
  });
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(
    Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1),
    totalPages,
  );
  const posts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );
  const categoryName =
    allPosts[0]?.categoryLabel ?? getFallbackCategoryName(id);

  return (
    <div className="flex min-h-full w-full flex-col bg-white pb-4">
      <section className="w-full border-b border-[#f1ddd8] bg-[#fff5f6] px-6 py-10">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-sage-800">
            Chủ đề
          </p>
          {/* <h1 className="mb-4 font-serif text-3xl  tracking-[0.02rem] text-sage-500/85 md:text-4xl"> */}
          <h1 className="mb-4 font-serif text-3xl font-normal leading-[1.4] tracking-normal  text-sage-500/85 md:text-[40px]">
            {categoryName}
          </h1>
          <p className="font-serif text-lg font-light  text-sage-800/85">
            Các bài viết thuộc chủ đề này được lấy trực tiếp từ Supabase.
          </p>
        </div>
      </section>

      <section className="w-full border-b border-[#f1ddd8] px-6 py-4">
        <form
          action={`/category/${id}`}
          className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center"
        >
          <label className="relative flex-1">
            <span className="sr-only">Tìm bài viết trong chủ đề</span>
            <Search
              className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b09090]"
              aria-hidden="true"
            />
            <input
              type="text"
              inputMode="search"
              name="q"
              defaultValue={searchQuery}
              placeholder="Tìm bài viết..."
              className="w-full rounded-full border border-[#f1ddd8] bg-white py-3 pl-12 pr-5 text-sm font-normal text-sage-800 shadow-none outline-none transition placeholder:text-[#b09090] hover:border-[#d96e83] focus:border-[#d96e83] focus:ring-2 focus:ring-[#f1ddd8]"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-[#d96e83] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c85f70]"
          >
            Tìm kiếm
          </button>
        </form>
      </section>

      {posts.length > 0 ? (
        <>
          <section className="flex w-full flex-1 flex-col">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="w-full border-b border-[#f1ddd8] bg-white transition-colors hover:bg-rose-50"
              >
                <article className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-8 md:flex-row md:items-center">
                  <div className="flex h-[110px] w-full flex-shrink-0 items-center justify-center rounded-[14px] border border-rose-200/65 bg-[#fce8eb] text-4xl shadow-sm transition-transform hover:scale-105 md:w-[160px]">
                    {post.thumbnailUrl ? (
                      <img
                        src={post.thumbnailUrl}
                        alt=""
                        className="h-full w-full rounded-[14px] object-cover"
                      />
                    ) : (
                      <span>{getCategoryIcon(post.categorySlug)}</span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-center">
                    <div className="mb-2">
                      <span className="rounded-full border border-sage-300 bg-sage-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sage-500">
                        {post.categoryLabel}
                      </span>
                    </div>
                    <h3 className="mb-2 line-clamp-2 font-serif text-xl font-bold tracking-[0.02rem] text-sage-800 transition-colors hover:text-[#d96e83]">
                      {post.title}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-base font-light text-sage-800/85">
                      {post.excerpt}
                    </p>
                    <div className="text-xs font-light uppercase tracking-[0.02rem] text-sage-800/85">
                      {post.date} <span className="mx-2">•</span>{" "}
                      {post.readTime}
                      <span className="mx-2">•</span> {post.commentCount} bình
                      luận
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </section>

          {allPosts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              getHref={(page) =>
                getPaginationHref({
                  categorySlug: id,
                  query: searchQuery,
                  page,
                })
              }
            />
          )}
        </>
      ) : (
        <section className="flex w-full flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-2xl rounded-3xl border border-rose-100 bg-[#fdfcf8] p-10 text-center shadow-sm">
            <div className="mb-4 text-4xl opacity-50">🍃</div>
            <h3 className="mb-2 font-serif text-xl text-sage-800">
              {searchQuery
                ? "Không tìm thấy bài viết phù hợp"
                : "Chưa có bài viết nào"}
            </h3>
            <p className="text-sm text-sage-800/60">
              {searchQuery ? (
                "Thử tìm với từ khóa khác trong chủ đề này."
              ) : (
                <>
                  Hiện tại chủ đề <strong>{categoryName}</strong> chưa có bài
                  viết nào.
                </>
              )}
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

function getFallbackCategoryName(slug: string) {
  return getBlogCategoryLabel(slug);
}

function getPaginationHref({
  categorySlug,
  query,
  page,
}: {
  categorySlug: string;
  query?: string;
  page: number;
}) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));

  const queryString = params.toString();
  return queryString
    ? `/category/${categorySlug}?${queryString}`
    : `/category/${categorySlug}`;
}

function getCategoryIcon(slug: string) {
  if (slug === "yoga") return "🧘";
  if (slug === "finance") return "💰";
  if (slug === "parenting") return "👶";
  return "🌻";
}
