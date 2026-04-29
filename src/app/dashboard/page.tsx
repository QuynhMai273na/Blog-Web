// src/app/dashboard/page.tsx
import React from "react";

export default function DashboardPage() {
  const stats = [
    { label: "Tổng bài viết", val: "24", sub: "+ 3 bài tháng này" },
    {
      label: "Lượt đọc / tháng",
      val: "1,842",
      sub: "↑ 12% so với tháng trước",
    },
    { label: "Bình luận chờ", val: "7", sub: "Cần xem xét", alert: true },
    { label: "Subscribers", val: "318", sub: "↑ 28 người mới" },
  ];

  return (
    <div className="flex min-h-screen bg-rose-50/30">
      {/* Sidebar tối màu với góc bo lớn bên phải */}
      <aside className="w-64 bg-[#4A3234] text-white/70 p-8 flex flex-col rounded-r-[40px] border-r border-rose-100/10">
        <h1 className="font-serif text-white text-xl italic mb-12 flex justify-center gap-2">
          <span className="text-rose-200">B</span>
          <span className="text-sage-300 italic">B</span>
        </h1>
        <nav className="space-y-6 flex-1 text-sm">
          <div className="text-white font-medium bg-white/10 p-3 rounded-xl cursor-pointer">
            Dashboard
          </div>
          <div className="hover:text-white cursor-pointer px-3 transition-colors">
            Bài viết
          </div>
          <div className="hover:text-white cursor-pointer px-3 transition-colors">
            Bình luận
          </div>
          <div className="hover:text-white cursor-pointer px-3 transition-colors">
            Thiết lập
          </div>
        </nav>
        <button className="text-left px-3 text-sm hover:text-white transition-colors">
          Đăng xuất
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-hidden">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-serif text-sage-800">Dashboard</h2>
          <button className="btn-primary opacity-60 flex items-center gap-2">
            <span>+</span> Viết bài mới
          </button>
        </header>

        {/* Các thẻ thống kê */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm transition-all hover:shadow-md"
            >
              <p className="text-xs text-sage-800/40 font-bold uppercase tracking-widest">
                {stat.label}
              </p>
              <div className="text-3xl font-serif text-sage-800 my-2">
                {stat.val}
              </div>
              <p
                className={`text-xs ${stat.alert ? "text-rose-200 font-medium" : "text-sage-300"}`}
              >
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Placeholder cho Table Mockup */}
        <div className="bg-white rounded-[32px] p-8 overflow-hidden border border-rose-100 shadow-sm min-h-[400px]">
          <h3 className="text-xl font-serif text-sage-800 mb-6">
            Bài viết gần đây
          </h3>
          <div className="border border-rose-100 rounded-2xl p-6 text-center text-sage-800/60 text-sm">
            [ Table Mockup bài viết sẽ được tích hợp ở đây ]
          </div>
        </div>
      </main>
    </div>
  );
}
