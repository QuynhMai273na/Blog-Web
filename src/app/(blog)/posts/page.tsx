import Link from "next/link";
import { Search } from "lucide-react";
import { PostActions } from "@/components/dashboard/PostActions";
import CustomSelect from "@/components/ui/CustomSelect";
import { Pagination } from "@/components/ui/Pagination";
import { getBlogCategoryStyle } from "@/constants/categories";
import { createClient } from "@/lib/supabase/server";
import { getCategoryOptions, getPublishedPosts } from "@/services/post.service";

type PostsPageProps = {
  searchParams?: Promise<{ cat?: string; page?: string; q?: string }>;
};

export const dynamic = "force-dynamic";
const POSTS_PER_PAGE = 4;

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const categorySlug =
    params?.cat && params.cat !== "all" ? params.cat : undefined;
  const searchQuery = params?.q?.trim() ?? "";
  const requestedPage = Number(params?.page ?? "1");
  const [allPosts, categories] = await Promise.all([
    getPublishedPosts({
      categorySlug,
      orderBy: "created_at",
      query: searchQuery,
    }),
    getCategoryOptions(),
  ]);
  const isAdmin = await getIsAdmin();
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(
    Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1),
    totalPages,
  );
  const posts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  const topicOptions = [
    { label: "Tất cả chủ đề", value: "all" },
    ...categories,
  ];

  return (
    <div className="flex min-h-full w-full flex-col bg-white pb-4">
      <section className="w-full border-b border-[#f1ddd8] bg-[#fff5f6] px-6 py-10">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-3 font-serif text-3xl font-normal leading-[1.4] tracking-normal text-text_primary md:text-[40px]">
            Tất cả bài viết
          </h1>
          <p className="font-serif text-base font-light  text-sage-800/85">
            những câu chuyện từ hành trình phát triển bản thân của mình
          </p>
        </div>
      </section>

      <section className="w-full border-b border-[#f1ddd8] px-6 py-4">
        <form
          action="/posts"
          className="mx-auto flex max-w-5xl flex-col gap-3 md:flex-row md:items-center"
        >
          <label className="relative flex-1">
            <span className="sr-only">Tìm bài viết</span>
            <Search
              className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b09090]"
              aria-hidden="true"
            />
            <input
              type="text"
              inputMode="search"
              name="q"
              defaultValue={searchQuery}
              placeholder="Tìm bài viết, chủ đề, tag..."
              className="w-full rounded-full border border-[#f1ddd8] bg-white py-3 pl-12 pr-5 text-sm font-normal text-sage-800 shadow-none outline-none transition placeholder:text-[#b09090] hover:border-[#d96e83] focus:border-[#d96e83] focus:ring-2 focus:ring-[#f1ddd8]"
            />
          </label>
          <CustomSelect
            name="cat"
            options={topicOptions}
            defaultValue={categorySlug ?? "all"}
            className="max-w-full md:w-64"
            buttonClassName="rounded-full border-[#f1ddd8] py-3 pl-6 pr-5 text-sm font-normal text-sage-800 shadow-none hover:border-[#d96e83] focus:border-[#d96e83] focus:ring-[#f1ddd8]"
            panelClassName="rounded-2xl border-[#f1ddd8]"
          />
          <button
            type="submit"
            className="rounded-full bg-[#d96e83] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c85f70]"
          >
            Lọc
          </button>
        </form>
      </section>

      <section className="flex w-full flex-1 flex-col">
        {posts.map((post) => {
          const categoryStyle = getBlogCategoryStyle(post.categorySlug);
          return (
            <article
              key={post.id}
              className="w-full border-b border-[#f1ddd8] bg-white transition-colors hover:bg-rose-50"
            >
              <div className="mx-auto flex max-w-5xl flex-col gap-5 px-6 py-8 md:flex-row md:items-center md:gap-10">
                <Link href={`/posts/${post.slug}`} className="contents">
                  <div
                    className={`flex h-[110px] w-full flex-shrink-0 items-center justify-center rounded-[14px] border border-rose-200/65 text-[40px] shadow-sm transition-transform hover:scale-105 md:w-[160px] ${categoryStyle.imageClass}`}
                  >
                    <span>{categoryStyle.icon}</span>
                  </div>

                  <div className="flex flex-1 flex-col justify-center">
                    <div className="mb-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${categoryStyle.tagClass}`}
                      >
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
                </Link>

                {isAdmin && (
                  <PostActions
                    postId={post.id}
                    slug={post.slug}
                    canView
                    className="shrink-0 justify-start md:w-[150px] md:justify-end"
                  />
                )}
              </div>
            </article>
          );
        })}
      </section>

      {allPosts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          getHref={(page) =>
            getPaginationHref({
              categorySlug,
              query: searchQuery,
              page,
            })
          }
        />
      )}

      {posts.length === 0 && (
        <section className="flex w-full flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-2xl rounded-3xl border border-rose-100 bg-[#fdfcf8] p-10 text-center shadow-sm">
            <div className="mb-4 text-4xl opacity-50">🍃</div>
            <h3 className="mb-2 font-serif text-xl text-sage-800">
              {searchQuery
                ? "Không tìm thấy bài viết phù hợp"
                : "Chưa có bài viết nào"}
            </h3>
            <p className="text-sm text-sage-800/60">
              {searchQuery
                ? "Thử tìm với từ khóa khác hoặc bỏ lọc chủ đề hiện tại."
                : "Nội dung trong chủ đề này sẽ được cập nhật sau."}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

function getPaginationHref({
  categorySlug,
  query,
  page,
}: {
  categorySlug?: string;
  query?: string;
  page: number;
}) {
  const params = new URLSearchParams();
  if (categorySlug) params.set("cat", categorySlug);
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));

  const queryString = params.toString();
  return queryString ? `/posts?${queryString}` : "/posts";
}

async function getIsAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("app_role")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.app_role === "admin";
}
