import Link from "next/link";
import React from "react";

import { getBlogCategoryStyle } from "@/constants/categories";
import type { PostCategory } from "@/services/post.service";

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  categoryLabel?: string;
  date: string;
  readTime: string;
  thumbnailUrl?: string | null;
  horizontal?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  slug,
  title,
  excerpt,
  category,
  categoryLabel,
  date,
  readTime,
  thumbnailUrl,
  horizontal = false,
}) => {
  const currentStyle = getBlogCategoryStyle(getCategorySlug(category));
  const tagText = categoryLabel ?? category;

  return (
    <Link
      href={`/posts/${slug}`}
      className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
    >
      <article
        className={[
          "group h-full overflow-hidden rounded-[24px] border border-[#f0e6e0] bg-white shadow-[0_4px_24px_rgba(74,44,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(74,44,42,0.08)]",
          horizontal ? "flex flex-col md:flex-row" : "flex flex-col",
        ].join(" ")}
      >
        <div
          className={[
            `relative flex items-center justify-center ${currentStyle.imageClass}`,
            horizontal
              ? "h-[180px] w-full md:h-auto md:w-[240px]"
              : "h-[180px] w-full",
          ].join(" ")}
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <>
              <span className="text-6xl drop-shadow-md transition-transform duration-500 group-hover:scale-110">
                {currentStyle.icon}
              </span>
              <span
                className={`absolute bottom-3 right-4 text-2xl opacity-60 ${currentStyle.decorClass}`}
              >
                {currentStyle.decorIcon}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-4">
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${currentStyle.tagClass}`}
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

function getCategorySlug(category: PostCategory) {
  if (category === "Yoga") return "yoga";
  if (category === "Tài chính") return "finance";
  if (category === "Parenting") return "parenting";
  return "life";
}
