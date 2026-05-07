export const BLOG_CATEGORIES = [
  { slug: "yoga", label: "Yoga & Sức khỏe" },
  { slug: "parenting", label: "Parenting" },
  { slug: "finance", label: "Tài chính cá nhân" },
  { slug: "life", label: "Cuộc sống" },
] as const;

export type BlogCategorySlug = (typeof BLOG_CATEGORIES)[number]["slug"];

export const BLOG_CATEGORY_SLUGS = BLOG_CATEGORIES.map(
  (category) => category.slug,
);

export function getBlogCategoryLabel(slug: string | null, fallback?: string | null) {
  return (
    BLOG_CATEGORIES.find((category) => category.slug === slug)?.label ??
    fallback ??
    "Cuộc sống"
  );
}
