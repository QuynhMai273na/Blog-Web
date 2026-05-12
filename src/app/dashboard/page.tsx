import Link from "next/link";
import { redirect } from "next/navigation";
import { PostActions } from "@/components/dashboard/PostActions";
import { createClient } from "@/lib/supabase/server";
import { getAdminPosts } from "@/services/post.service";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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
    pendingCommentsCount,
    subscribersCount,
    adminPosts,
  ] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("is_approved", false),
    supabase.from("subscribers").select("id", { count: "exact", head: true }),
    getAdminPosts({ limit: 8 }),
  ]);

  const stats = [
    {
      label: "Tổng bài viết",
      value: String(postsCount.count ?? 0),
      sub: "Đọc từ bảng posts",
      type: "success",
    },
    {
      label: "Bài đã đăng",
      value: String(adminPosts.filter((post) => post.status === "published").length),
      sub: "Trong danh sách gần nhất",
      type: "success",
    },
    {
      label: "Bình luận chờ duyệt",
      value: String(pendingCommentsCount.count ?? 0),
      sub: "Cần xem xét",
      type: "warning",
    },
    {
      label: "Subscribers",
      value: String(subscribersCount.count ?? 0),
      sub: "Từ bảng subscribers",
      type: "success",
    },
  ];

  return (
    <div className="flex h-full w-full overflow-hidden bg-cream">
      <aside className="flex h-full w-[240px] shrink-0 flex-col overflow-hidden bg-[#3e2829] pt-10 text-[#b09090]">
        <div className="mb-10 px-8">
          <h1 className="font-serif text-[22px] leading-tight">
            <span className="text-[#d96e83] ">Admin</span>
          </h1>
        </div>

        <nav className="flex flex-col gap-2 px-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-[#4d3637] px-4 py-2.5 text-sm font-medium text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/write"
            className="rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#4d3637] hover:text-white"
          >
            Viết bài
          </Link>
          <Link
            href="/posts"
            className="rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#4d3637] hover:text-white"
          >
            Xem blog
          </Link>
        </nav>
      </aside>

      <main className="h-full flex-1 overflow-y-auto p-6 md:p-8">
        <header className="mb-10 flex items-center justify-between">
          <h2 className="font-serif text-3xl text-[#3a2520]">
            Quản trị hệ thống
          </h2>
          <Link
            href="/dashboard/write"
            className="rounded-full border border-sage-300 bg-sage-50 px-6 py-2.5 text-sm font-medium text-sage-500 transition-colors hover:bg-sage-100 hover:font-semibold"
          >
            + Viết bài mới
          </Link>
        </header>

        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#f0e6e0] bg-white p-6 shadow-sm transition-transform hover:-translate-y-1"
            >
              <p className="mb-2 text-xs font-medium text-[#7a5a55]">
                {stat.label}
              </p>
              <div className="mb-2 font-serif text-4xl text-[#3a2520]">
                {stat.value}
              </div>
              <p
                className={`text-[11px]  ${
                  stat.type === "success" ? "text-[#6b9b84]" : "text-[#d96e83]"
                }`}
              >
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-[24px] border border-[#f0e6e0] bg-white shadow-sm">
          <div className="grid grid-cols-[4fr_2fr_2fr_2fr] bg-[#fff5f6] px-6 py-4">
            <div className="text-sm font-medium text-[#d96e83]">
              Tiêu đề bài viết
            </div>
            <div className="text-sm font-medium text-[#d96e83]">Danh mục</div>
            <div className="text-sm font-medium text-[#d96e83]">
              Trạng thái
            </div>
            <div className="pr-4 text-right text-sm font-medium text-[#d96e83]">
              Hành động
            </div>
          </div>

          <div className="flex flex-col">
            {adminPosts.map((post) => (
              <div
                key={post.id}
                className="grid grid-cols-[4fr_2fr_2fr_2fr] items-center border-t border-[#f0e6e0] px-6 py-5 transition-colors hover:bg-[#fafafa]"
              >
                <div className="pr-4 font-serif text-[15px] text-[#3a2520]">
                  {post.title}
                </div>
                <div className="text-sm text-[#7a5a55]">
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
                />
              </div>
            ))}
          </div>
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
