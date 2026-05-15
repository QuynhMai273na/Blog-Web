import Link from "next/link";
import { redirect } from "next/navigation";
import AutoRefresh from "@/components/common/AutoRefresh";
import { PostActions } from "@/components/dashboard/PostActions";
import { Pagination } from "@/components/ui/Pagination";
import { createClient } from "@/lib/supabase/server";
import { getAdminPosts } from "@/services/post.service";

export const dynamic = "force-dynamic";
const POSTS_PER_PAGE = 8;

type DashboardPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const requestedPage = Number(params?.page ?? "1");
  const currentPage = Math.max(
    Number.isFinite(requestedPage) ? Math.floor(requestedPage) : 1,
    1,
  );
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("app_role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.app_role !== "admin") {
    redirect("/");
  }

  const [
    postsCount,
    publishedPostsCount,
    pendingCommentsCount,
    subscribersCount,
  ] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("is_approved", false),
    supabase.from("subscribers").select("id", { count: "exact", head: true }),
  ]);
  const totalPosts = postsCount.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const offset = (safeCurrentPage - 1) * POSTS_PER_PAGE;
  const adminPosts = await getAdminPosts({ limit: POSTS_PER_PAGE, offset });
  const pageStart = totalPosts === 0 ? 0 : offset + 1;
  const pageEnd = Math.min(offset + adminPosts.length, totalPosts);

  const stats = [
    {
      label: "Tổng bài viết",
      value: String(totalPosts),
      sub: "Tổng số bài viết trong hệ thống",
      type: "success",
    },
    {
      label: "Bài đã đăng",
      value: String(publishedPostsCount.count ?? 0),
      sub: "Tổng số bài viết đã được publish",
      type: "success",
    },
    {
      label: "Bình luận chờ duyệt",
      value: String(pendingCommentsCount.count ?? 0),
      sub: "Số bình luận chưa được duyệt",
      type: "warning",
    },
    {
      label: "Subscribers",
      value: String(subscribersCount.count ?? 0),
      sub: "Số người đăng ký nhận email thông báo",
      type: "success",
    },
  ];

  return (
    <div className="flex min-h-full w-full flex-col overflow-y-auto bg-cream lg:h-full lg:flex-row lg:overflow-hidden">
      <AutoRefresh intervalMs={30000} />
      <aside className="flex w-full shrink-0 flex-col bg-[#3e2829] px-4 py-4 text-[#b09090] lg:h-full lg:w-[240px] lg:overflow-hidden lg:px-0 lg:pt-10">
        <div className="mb-4 px-2 lg:mb-10 lg:px-8">
          <h1 className="truncate font-serif text-[20px] leading-tight lg:text-[22px]">
            <span className="text-[#d96e83] ">
              {user.user_metadata.full_name}
            </span>
          </h1>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:px-4">
          <Link
            href="/dashboard"
            className="whitespace-nowrap rounded-lg bg-[#4d3637] px-4 py-2.5 text-sm font-medium text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/write"
            className="whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#4d3637] hover:text-white"
          >
            Viết bài
          </Link>
          <Link
            href="/posts"
            className="whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#4d3637] hover:text-white"
          >
            Xem blog
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:h-full lg:overflow-y-auto lg:p-8">
        <header className="mb-6 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-serif text-2xl text-[#3a2520] sm:text-3xl">
            Quản trị hệ thống
          </h2>
          <Link
            href="/dashboard/write"
            className="inline-flex w-full justify-center rounded-full border border-sage-300 bg-sage-50 px-6 py-2.5 text-sm font-medium text-sage-500 transition-colors hover:bg-sage-100 hover:font-semibold sm:w-auto"
          >
            + Viết bài mới
          </Link>
        </header>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#f0e6e0] bg-white p-5 shadow-sm transition-transform hover:-translate-y-1 sm:p-6"
            >
              <p className="mb-2 text-sm font-medium text-[#7a5a55]">
                {stat.label}
              </p>
              <div className="mb-2 font-serif text-4xl text-[#3a2520]">
                {stat.value}
              </div>
              <p
                className={`text-xs  ${
                  stat.type === "success" ? "text-[#6b9b84]" : "text-[#d96e83]"
                }`}
              >
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-[24px] border border-[#f0e6e0] bg-white shadow-sm">
          <div className="hidden grid-cols-[4fr_2fr_2fr_2fr] bg-[#fff5f6] px-6 py-4 lg:grid">
            <div className="text-base font-medium text-[#d96e83]">
              Tiêu đề bài viết
            </div>
            <div className="text-base font-medium text-[#d96e83]">Danh mục</div>
            <div className="text-base font-medium text-[#d96e83]">
              Trạng thái
            </div>
            <div className="pr-4 text-right text-base font-medium text-[#d96e83]">
              Hành động
            </div>
          </div>

          <div className="flex flex-col">
            {adminPosts.length > 0 ? (
              adminPosts.map((post) => (
                <div
                  key={post.id}
                  className="grid gap-3 border-t border-[#f0e6e0] px-4 py-5 transition-colors hover:bg-[#fafafa] lg:grid-cols-[4fr_2fr_2fr_2fr] lg:items-center lg:px-6"
                >
                  <div className="min-w-0 pr-4 text-sm font-semibold text-text_primary lg:overflow-hidden lg:text-ellipsis lg:whitespace-nowrap lg:font-normal">
                    {post.title}
                  </div>
                  <div className="text-sm text-text_primary">
                    <span className="mr-2 text-xs font-semibold uppercase text-[#b09090] lg:hidden">
                      Danh mục:
                    </span>
                    {post.categoryLabel}
                  </div>
                  <div>
                    <span className="inline-flex flex-col rounded-full border border-[#d1e7dd] bg-[#f1f8f5] px-3 py-1 text-[11px] font-medium leading-4 text-[#6b9b84]">
                      <span>{getStatusLabel(post.status)}</span>
                      <span className="font-normal text-[#7c9283]">
                        {getStatusTimeLabel(post.status, post.publishTime)}
                      </span>
                    </span>
                  </div>

                  <PostActions
                    postId={post.id}
                    slug={post.slug}
                    canView={post.status === "published"}
                    isFeatured={post.isFeatured}
                    className="items-start lg:items-end"
                  />
                </div>
              ))
            ) : (
              <div className="border-t border-[#f0e6e0] px-6 py-10 text-center text-sm text-[#7a5a55]">
                Chưa có bài viết nào.
              </div>
            )}
          </div>

          {totalPosts > 0 && (
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              getHref={getDashboardPageHref}
              summary={`Hiển thị ${pageStart}-${pageEnd} trong ${totalPosts} bài viết`}
              className="border-t border-[#f0e6e0] bg-[#fdfcf8]"
            />
          )}
        </div>
      </main>
    </div>
  );
}

function getStatusLabel(status?: string) {
  if (status === "published") return "Đã đăng";
  if (status === "scheduled") return "Đã lên lịch";
  return "Bản nháp";
}

function getStatusTimeLabel(status?: string, publishTime?: string) {
  if (!publishTime) return "Chưa có lịch đăng";
  if (status === "scheduled") return `Lên lịch: ${publishTime}`;
  if (status === "published") return `Đăng: ${publishTime}`;
  return "Chưa đăng";
}

function getDashboardPageHref(page: number) {
  return page > 1 ? `/dashboard?page=${page}` : "/dashboard";
}
