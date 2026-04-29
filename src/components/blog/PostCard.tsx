// src/components/blog/PostCard.tsx
import React from "react";

interface PostCardProps {
  title: string;
  excerpt: string;
  category: "Yoga" | "Tài chính" | "Parenting";
  date: string;
  readTime: string;
  horizontal?: boolean; // Hỗ trợ bố cục ngang cho bài viết nổi bật
}

const PostCard: React.FC<PostCardProps> = ({
  title,
  excerpt,
  category,
  date,
  readTime,
  horizontal,
}) => {
  const tagClass =
    category === "Yoga"
      ? "tag-yoga"
      : category === "Tài chính"
        ? "tag-finance"
        : "tag-parenting";
  const emoji =
    category === "Yoga" ? "🧘" : category === "Tài chính" ? "💰" : "👶";

  return (
    <div
      className={`post-card bg-white p-6 rounded-4xl border border-rose-100/30 shadow-sm hover:shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${horizontal ? "flex gap-6 items-center" : "flex flex-col"}`}
    >
      {/* Placeholder cho hình ảnh bài viết */}
      <div
        className={`aspect-video rounded-3xl mb-4 bg-gray-50 flex items-center justify-center text-4xl border border-rose-50 ${horizontal ? "w-48 mb-0 flex-shrink-0" : "w-full"}`}
      >
        {emoji}
      </div>
      <div className="flex-1">
        <span className={`tag ${tagClass}`}>{category}</span>
        <h3 className="font-serif text-xl mt-3 mb-2 text-sage-800 leading-snug">
          {title}
        </h3>
        <p className="text-sage-800/60 text-sm line-clamp-2 mb-4 font-light leading-relaxed">
          {excerpt}
        </p>
        <div className="text-xs uppercase tracking-[0.2em] text-sage-800/40 font-bold">
          {date} • {readTime}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
