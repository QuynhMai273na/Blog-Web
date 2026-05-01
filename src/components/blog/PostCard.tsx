import Link from "next/link";
import React from "react";

import type { PostCategory } from "@/services/post.service";

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  categoryLabel?: string;
  date: string;
  readTime: string;
  horizontal?: boolean;
}

const styleMap: Record<
  PostCategory,
  {
    bg: string;
    tag: string;
    emoji: string;
    decor: string;
    decorColor: string;
  }
> = {
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
  "Cuộc sống": {
    bg: "bg-[#fcf5ea]",
    tag: "bg-[#fcf5ea] text-[#b78a54] border-[#f1ddd8]",
    emoji: "🌻",
    decor: "🌿",
    decorColor: "text-[#b78a54]",
  },
};

const PostCard: React.FC<PostCardProps> = ({
  slug,
  title,
  excerpt,
  category,
  categoryLabel,
  date,
  readTime,
  horizontal = false,
}) => {
  const currentStyle = styleMap[category];
  const tagText = categoryLabel ?? category;

  return (
    <Link
      href={`/posts/${slug}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
    >
      <article
        className={[
          "group overflow-hidden rounded-[24px] border border-[#f0e6e0] bg-white shadow-[0_4px_24px_rgba(74,44,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(74,44,42,0.08)]",
          horizontal ? "flex flex-col md:flex-row" : "flex flex-col",
        ].join(" ")}
      >
        <div
          className={[
            `relative flex items-center justify-center ${currentStyle.bg}`,
            horizontal
              ? "h-[180px] w-full md:h-auto md:w-[240px]"
              : "h-[180px] w-full",
          ].join(" ")}
        >
          <span className="text-6xl drop-shadow-md transition-transform duration-500 group-hover:scale-110">
            {currentStyle.emoji}
          </span>
          <span
            className={`absolute bottom-3 right-4 text-2xl opacity-60 ${currentStyle.decorColor}`}
          >
            {currentStyle.decor}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-4">
            <span
              className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${currentStyle.tag}`}
            >
              {tagText}
            </span>
          </div>

          <h3 className="mb-3 line-clamp-2 font-serif text-lg font-bold leading-snug text-[#3a2520]">
            {title}
          </h3>

          <p
            className={[
              "mb-6 flex-1 text-sm font-light leading-relaxed text-[#7a5a55]",
              horizontal ? "line-clamp-3" : "line-clamp-2",
            ].join(" ")}
          >
            {excerpt}
          </p>

          <div className="mt-auto text-[10px] font-medium uppercase tracking-[0.1em] text-[#b09090]">
            {date} <span className="mx-1">•</span> {readTime}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PostCard;
