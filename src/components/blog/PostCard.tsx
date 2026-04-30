import React from "react";

interface PostCardProps {
  title: string;
  excerpt: string;
  category: "Yoga" | "Tài chính" | "Parenting";
  date: string;
  readTime: string;
}

const PostCard: React.FC<PostCardProps> = ({
  title,
  excerpt,
  category,
  date,
  readTime,
}) => {
  // Cấu hình màu sắc, icon và họa tiết góc cho từng Category
  const styleMap = {
    Yoga: {
      bg: "bg-[#fce8eb]",
      tag: "bg-[#f1f8f5] text-[#6b9b84] border-[#d1e7dd]",
      emoji: "🧘",
      decor: "🌸",
      decorColor: "text-[#f2a7b0]",
    },
    "Tài chính": {
      bg: "bg-[#dcefd8]",
      tag: "bg-[#fdf6f0] text-[#c98e55] border-[#f1ddd8]",
      emoji: "💰",
      decor: "🌿",
      decorColor: "text-[#a8c89a]",
    },
    Parenting: {
      bg: "bg-[#f9f2ee]",
      tag: "bg-[#fce8eb] text-[#d96e83] border-[#f2a7b0]",
      emoji: "👶",
      decor: "🌷",
      decorColor: "text-[#d96e83]",
    },
  };

  const currentStyle = styleMap[category];

  return (
    <div className="group bg-white rounded-[24px] overflow-hidden border border-[#f0e6e0] shadow-[0_4px_24px_rgba(74,44,42,0.04)] hover:shadow-[0_8px_32px_rgba(74,44,42,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Nửa trên: Hình ảnh/Mảng màu pastel tràn viền */}
      <div
        className={`relative h-[180px] w-full flex items-center justify-center ${currentStyle.bg}`}
      >
        <span className="text-6xl drop-shadow-md transition-transform duration-500 group-hover:scale-110">
          {currentStyle.emoji}
        </span>
        {/* Họa tiết nhỏ ở góc dưới phải */}
        <span
          className={`absolute bottom-3 right-4 text-2xl opacity-60 ${currentStyle.decorColor}`}
        >
          {currentStyle.decor}
        </span>
      </div>

      {/* Nửa dưới: Nội dung text */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <span
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${currentStyle.tag}`}
          >
            {category}
          </span>
        </div>

        <h3 className="font-serif text-lg font-bold text-[#3a2520] leading-snug mb-3 line-clamp-2">
          {title}
        </h3>

        <p className="text-[#7a5a55] text-sm leading-relaxed font-light line-clamp-2 mb-6 flex-1">
          {excerpt}
        </p>

        <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#b09090] mt-auto">
          {date} <span className="mx-1">•</span> {readTime}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
