import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1a1a1a] py-8 px-4">
      <div className="max-w-5xl mx-auto overflow-hidden rounded-[30px]">
        {/* 1. Dải màu Gradient phía trên */}
        <div className="h-6 w-full bg-gradient-to-r from-footer-pink via-[#b8b0a9] to-footer-green" />

        {/* 2. Phần nội dung chính màu trắng */}
        <div className="bg-white py-10 flex flex-col items-center justify-center">
          <p className="text-[#a68e8e] text-sm md:text-base font-light flex items-center gap-2 tracking-wide">
            <span>© 2026 Becoming Blooming</span>
            <span className="mx-1">·</span>
            <span>Được làm bằng</span>
            <span className="text-[#ff6b81] text-lg">🌸</span>
            <span>và nhiều tách trà</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
