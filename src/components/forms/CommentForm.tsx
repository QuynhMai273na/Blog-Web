"use client";

import { useState } from "react";

export default function CommentForm() {
  const [comment, setComment] = useState("");

  return (
    <div className="mt-6">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Chia sẻ cảm nghĩ của bạn..."
        className="input-field min-h-36 rounded-[24px] border-rose-200 bg-[#2f2d2b] px-5 py-4 font-serif text-[15px]  text-white shadow-[0_8px_24px_rgba(45,62,47,0.16)] placeholder:text-[#9f9592] focus:border-rose-300 focus:ring-rose-200"
      />
      <button
        type="button"
        disabled={!comment.trim()}
        className={`mt-4 inline-flex items-center rounded-full px-6 py-2.5 text-[13px] font-medium shadow-sm transition-all duration-300 ${
          comment.trim()
            ? "border border-rose-200 bg-white text-[#7b6262] hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-400 hover:shadow-[0_6px_16px_rgba(214,156,161,0.2)]"
            : "cursor-not-allowed border border-rose-100/50 bg-white/40 text-[#c5b4b4]"
        }`}
      >
        Gửi bình luận
      </button>
    </div>
  );
}
