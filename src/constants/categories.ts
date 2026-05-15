export const BLOG_CATEGORIES = [
  {
    slug: "yoga",
    label: "Yoga & Sức khỏe",
    tagClass: "bg-sage-100 text-sage-500 border border-sage-300",
    imageClass: "bg-[#e6f7f2]",
    heroImage: "/images/bg_img_yoga.png",
    icon: "🧘",
    decorIcon: "🌸",
    decorClass: "text-[#d96e83]",
  },
  {
    slug: "parenting",
    label: "Làm mẹ",
    tagClass: "bg-rose-100 text-rose-500 border border-rose-400",
    imageClass: "bg-[#fce8eb]",
    heroImage: "/images/bg_img_parenting.png",
    icon: "👶",
    decorIcon: "🌸",
    decorClass: "text-[#d96e83]",
  },
  {
    slug: "finance",
    label: "Tài chính cá nhân",
    tagClass: "bg-sand-100 text-sand-500 border border-sand-300",
    imageClass: "bg-[#dcefd8]",
    heroImage: "/images/bg_img_finance.png",
    icon: "💰",
    decorIcon: "🌸",
    decorClass: "text-[#d96e83]",
  },
  {
    slug: "life",
    label: "Cuộc sống",
    tagClass: "bg-[#f3eefc] text-[#8b6bb8] border border-[#d9c8f0]",
    imageClass: "bg-[#f4effb]",
    heroImage: "/images/bg_img_life.png",
    icon: "🌻",
    decorIcon: "🌸",
    decorClass: "text-[#d96e83]",
  },
] as const;

export const DEFAULT_BLOG_CATEGORY_STYLE = {
  tagClass: "bg-sand-100 text-sand-500 border border-sand-300",
  imageClass: "bg-[#f9f2ee]",
  heroImage: "/images/bg_img_life.png",
  icon: "🌻",
  decorIcon: "🌸",
  decorClass: "text-[#d96e83]",
} as const;

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

export function getBlogCategoryStyle(slug: string | null) {
  const category = BLOG_CATEGORIES.find((item) => item.slug === slug);

  return category
    ? {
        tagClass: category.tagClass,
        imageClass: category.imageClass,
        heroImage: category.heroImage,
        icon: category.icon,
        decorIcon: category.decorIcon,
        decorClass: category.decorClass,
      }
    : DEFAULT_BLOG_CATEGORY_STYLE;
}
