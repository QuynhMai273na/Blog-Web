// src/app/dashboard/page.tsx
import Link from "next/link";

export default function DashboardPage() {
  // Dữ liệu mẫu cho các thẻ thống kê
  const stats = [
    {
      label: "Tổng bài viết",
      value: "24",
      sub: "↑ 3 bài tháng này",
      type: "success",
    },
    {
      label: "Lượt đọc / tháng",
      value: "1,842",
      sub: "↑ 12% so tháng trước",
      type: "success",
    },
    {
      label: "Bình luận chờ duyệt",
      value: "7",
      sub: "Cần xem xét",
      type: "warning",
    },
    {
      label: "Subscribers",
      value: "318",
      sub: "↑ 28 người mới",
      type: "success",
    },
  ];

  // Dữ liệu mẫu cho bảng bài viết
  const recentPosts = [
    {
      title: "5 động tác yoga giúp mẹ bầu ngủ ngon",
      category: "Yoga",
      status: "Đã đăng",
    },
    {
      title: "Tiết kiệm 30% thu nhập mà không thiếu thốn",
      category: "Tài chính",
      status: "Đã đăng",
    },
    {
      title: "Nhật ký 30 ngày không dùng điện thoại buổi sáng",
      category: "Cuộc sống",
      status: "Bản nháp",
    },
    {
      title: "Khi con khóc mà mình không hiểu tại sao",
      category: "Parenting",
      status: "Đã đăng",
    },
  ];

  return (
    // Bỏ background tối và padding, cho khối này chiếm toàn màn hình (min-h-screen w-full)
    <div className="flex h-full w-full overflow-hidden bg-cream">
      {/* 1. Sidebar (Cột trái nền tối, kéo dài full chiều cao) */}
      <aside className="flex h-full w-[240px] shrink-0 flex-col overflow-hidden bg-[#3e2829] pt-10  text-[#b09090]">
        {/* Logo */}
        <div className="mb-10 px-8">
          <h1 className="font-serif text-[22px] leading-tight">
            <span className="text-[#d96e83] italic">Admin&apos;s Full Name</span>
          </h1>
        </div>

        {/* Menu Navigation */}
        <nav className="flex flex-col gap-2 px-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-[#4d3637] px-4 py-2.5 text-sm font-medium text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/posts"
            className="rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#4d3637] hover:text-white"
          >
            Bài viết
          </Link>
          <Link
            href="/dashboard/comments"
            className="rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#4d3637] hover:text-white"
          >
            Bình luận
          </Link>

          <Link
            href="/dashboard/categories"
            className="rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#4d3637] hover:text-white"
          >
            Danh mục & Tags
          </Link>
          <Link
            href="/dashboard/settings"
            className="rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#4d3637] hover:text-white"
          >
            Cài đặt
          </Link>
        </nav>

        {/* Spacer đẩy Đăng xuất xuống đáy */}
        <div className="mt-auto px-4 py-4 border-t border-[#4d3637] pt-4 mx-4">
          <button className=" h-full w-full rounded-lg  text-left text-sm font-medium transition-colors hover:bg-[#4d3637] hover:text-white">
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* 2. Main Content (Cột phải nền be nhạt, trải dài hết phần màn hình còn lại) */}
      <main className="h-full flex-1 overflow-y-auto p-6 md:p-8">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <h2 className="font-serif text-3xl text-[#3a2520]">
            Quản trị hệ thống
          </h2>
          <button className="rounded-full border border-sage-300 px-6 py-2.5 text-sm font-medium text-sage-500 bg-sage-50 transition-colors hover:font-semibold hover:bg-sage-100">
            + Viết bài mới
          </button>
        </header>

        {/* Stats Grid (4 thẻ thống kê) */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#f0e6e0] bg-white p-6 shadow-sm transition-transform hover:-translate-y-1"
            >
              <p className="mb-2 text-xs font-medium text-[#7a5a55]">
                {stat.label}
              </p>
              <div className="mb-2 font-serif text-4xl text-[#3a2520]">
                {stat.value}
              </div>
              <p
                className={`text-[11px] italic ${stat.type === "success" ? "text-[#6b9b84]" : "text-[#d96e83]"}`}
              >
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Table (Bảng bài viết) */}
        <div className="overflow-hidden rounded-[24px] border border-[#f0e6e0] bg-white shadow-sm">
          {/* Table Header (Nền hồng nhạt) */}
          <div className="grid grid-cols-[4fr_2fr_2fr_2fr] bg-[#fff5f6] px-6 py-4">
            <div className="text-sm font-medium text-[#d96e83]">
              Tiêu đề bài viết
            </div>
            <div className="text-sm font-medium text-[#d96e83]">Danh mục</div>
            <div className="text-sm font-medium text-[#d96e83]">Trạng thái</div>
            <div className="text-sm font-medium text-[#d96e83] text-right pr-4">
              Hành động
            </div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col">
            {recentPosts.map((post, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[4fr_2fr_2fr_2fr] items-center border-t border-[#f0e6e0] px-6 py-5 transition-colors hover:bg-[#fafafa]"
              >
                <div className="pr-4 font-serif text-[15px] text-[#3a2520]">
                  {post.title}
                </div>
                <div className="text-sm text-[#7a5a55]">{post.category}</div>
                <div>
                  {/* Status Pill */}
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-medium ${
                      post.status === "Đã đăng"
                        ? "border-[#d1e7dd] bg-[#f1f8f5] text-[#6b9b84]"
                        : "border-[#f1ddd8] bg-[#fdf6f0] text-[#c98e55]"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  <button className="rounded-lg border border-[#e5e5e5] px-4 py-1.5 text-xs font-medium text-[#b3b3b3] transition-colors hover:bg-gray-50 hover:text-gray-600">
                    Sửa
                  </button>
                  <button className="flex items-center justify-center rounded-lg border border-[#f2a7b0] px-3 py-1.5 text-xs font-medium text-[#d96e83] transition-colors hover:bg-[#fff5f6]">
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
