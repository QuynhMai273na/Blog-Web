
import Link from "next/link";
import { getBlogCategoryLabel } from "@/constants/categories";
import { getPublishedPosts } from "@/services/post.service";

export const dynamic = "force-dynamic";
const POSTS_PER_PAGE = 4;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const requestedPage = Number(query?.page ?? "1");
  const allPosts = await getPublishedPosts({
    categorySlug: id,
    orderBy: "created_at",
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
  const categoryName = allPosts[0]?.categoryLabel ?? getFallbackCategoryName(id);

  return (
    <div className="flex min-h-full w-full flex-col bg-white pb-4">
      <section className="w-full border-b border-[#f1ddd8] bg-[#fff5f6] px-6 py-10">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-sage-800">
            Chủ đề
          </p>
          <h1 className="mb-4 font-serif text-3xl  tracking-[0.02rem] text-sage-500/85 md:text-4xl">
            {categoryName}
          </h1>
          <p className="font-serif text-lg font-light  text-sage-800/85">
            Các bài viết thuộc chủ đề này được lấy trực tiếp từ Supabase.
          </p>
        </div>
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
                  <span>{getCategoryIcon(post.categorySlug)}</span>
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
                    {post.date} <span className="mx-2">•</span> {post.readTime}
                    <span className="mx-2">•</span> {post.commentCount} bình
                    luận
                  </div>
                </div>
              </article>
            </Link>
          ))}
          </section>

          {allPosts.length > 0 && (
            <section className="w-full bg-[#fdfcf8] py-6">
              <div className="flex flex-wrap items-center justify-center gap-3 px-4">
                {currentPage > 1 ? (
                  <Link
                    href={getPaginationHref({ categorySlug: id, page: currentPage - 1 })}
                    className="rounded-full border border-[#f1ddd8] bg-white px-5 py-2.5 text-sm font-medium text-sage-800 shadow-sm transition-colors hover:bg-[#fff5f6] hover:text-[#d96e83]"
                  >
                    ← Trước
                  </Link>
                ) : (
                  <span className="rounded-full border border-[#f1ddd8] bg-white px-5 py-2.5 text-sm font-medium text-sage-800/35 shadow-sm">
                    ← Trước
                  </span>
                )}

                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;
                  const isActive = page === currentPage;

                  return (
                    <Link
                      key={page}
                      href={getPaginationHref({ categorySlug: id, page })}
                      aria-current={isActive ? "page" : undefined}
                      className={
                        isActive
                          ? "flex h-10 w-10 items-center justify-center rounded-full bg-[#d96e83] text-sm font-bold text-white shadow-md transition-colors hover:bg-[#c85f70]"
                          : "flex h-10 w-10 items-center justify-center rounded-full border border-[#f1ddd8] bg-white text-sm font-medium text-sage-800 shadow-sm transition-colors hover:bg-[#fff5f6] hover:text-[#d96e83]"
                      }
                    >
                      {page}
                    </Link>
                  );
                })}

                {currentPage < totalPages ? (
                  <Link
                    href={getPaginationHref({ categorySlug: id, page: currentPage + 1 })}
                    className="rounded-full border border-[#f1ddd8] bg-white px-5 py-2.5 text-sm font-medium text-sage-800 shadow-sm transition-colors hover:bg-[#fff5f6] hover:text-[#d96e83]"
                  >
                    Sau →
                  </Link>
                ) : (
                  <span className="rounded-full border border-[#f1ddd8] bg-white px-5 py-2.5 text-sm font-medium text-sage-800/35 shadow-sm">
                    Sau →
                  </span>
                )}
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="flex w-full flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-2xl rounded-3xl border border-rose-100 bg-[#fdfcf8] p-10 text-center shadow-sm">
            <div className="mb-4 text-4xl opacity-50">🍃</div>
            <h3 className="mb-2 font-serif text-xl text-sage-800">
              Chưa có bài viết nào
            </h3>
            <p className="text-sm text-sage-800/60">
              Hiện tại chủ đề <strong>{categoryName}</strong> chưa có bài viết
              nào.
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
  page,
}: {
  categorySlug: string;
  page: number;
}) {
  return page > 1 ? `/category/${categorySlug}?page=${page}` : `/category/${categorySlug}`;
}

function getCategoryIcon(slug: string) {
  if (slug === "yoga") return "🧘";
  if (slug === "finance") return "💰";
  if (slug === "parenting") return "👶";
  return "🌻";
}
