export const BLOG_CATEGORIES = [
  {
    slug: "yoga",
    label: "Yoga & Sức khỏe",
    tagClass: "border-[#d1e7dd] bg-[#f1f8f5] text-[#6b9b84]",
  },
  {
    slug: "parenting",
    label: "Làm mẹ",
    tagClass: "border-[#f2a7b0] bg-[#fce8eb] text-[#d96e83]",
  },
  {
    slug: "finance",
    label: "Tài chính cá nhân",
    tagClass: "border-[#f1ddd8] bg-[#fdf6f0] text-[#c98e55]",
  },
  {
    slug: "life",
    label: "Cuộc sống",
    tagClass: "border-[#d1e7dd] bg-[#f1f8f5] text-[#6b9b84]",
  },
] as const;

export type BlogCategorySlug = (typeof BLOG_CATEGORIES)[number]["slug"];

export const BLOG_CATEGORY_SLUGS = BLOG_CATEGORIES.map(
  (category) => category.slug,
);

export function getBlogCategoryLabel(
  slug: string | null,
  fallback?: string | null,
) {
  return (
    BLOG_CATEGORIES.find((category) => category.slug === slug)?.label ??
    fallback ??
    "Cuộc sống"
  );
}
