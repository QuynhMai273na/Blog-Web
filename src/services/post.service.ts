import {
  BLOG_CATEGORIES,
  getBlogCategoryLabel,
} from "@/constants/categories";
import { createClient } from "@/lib/supabase/server";

export type PostCategory = "Yoga" | "Tài chính" | "Parenting" | "Cuộc sống";

export type BlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  categoryLabel: string;
  categorySlug: string;
  date: string;
  readTime: string;
  commentCount: number;
};

export type BlogPostDetail = BlogPostSummary & {
  content: string;
  paragraphs: string[];
  sections: Array<{
    heading: string;
    body: string;
  }>;
};

type CategoryRow = {
  name: string | null;
  slug: string | null;
};

type PostRow = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  published_at: string | null;
  created_at: string | null;
  categories: CategoryRow | CategoryRow[] | null;
};

export async function getPublishedPosts(options?: {
  limit?: number;
  categorySlug?: string;
  orderBy?: "published_at" | "created_at";
}) {
  const supabase = createClient();
  const selectClause =
    "id,title,slug,summary,content,published_at,created_at,categories!inner(name,slug)";

  let query = supabase
    .from("posts")
    .select(selectClause)
    .eq("status", "published")
    .order(options?.orderBy ?? "published_at", { ascending: false });

  if (options?.categorySlug) {
    query = query.eq("categories.slug", options.categorySlug);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[posts.list]", error);
    return [];
  }

  return attachCommentCounts((data ?? []) as PostRow[]);
}

export async function getLatestPostsByCategorySlugs(categorySlugs: string[]) {
  const postsByCategory = await Promise.all(
    categorySlugs.map((categorySlug) =>
      getPublishedPosts({ categorySlug, limit: 1 }),
    ),
  );

  return postsByCategory.flatMap((posts) => posts);
}

export async function getPostBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id,title,slug,summary,content,published_at,created_at,categories(name,slug)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("[posts.detail]", error);
    return null;
  }

  if (!data) {
    return null;
  }

  const [post] = await attachCommentCounts([data as PostRow]);
  return toPostDetail(data as PostRow, post.commentCount);
}

export async function getRelatedPosts(post: BlogPostSummary, limit = 3) {
  const posts = await getPublishedPosts({
    categorySlug: post.categorySlug,
    limit: limit + 1,
  });

  return posts.filter((item) => item.id !== post.id).slice(0, limit);
}

export async function getCategoryOptions() {
  return BLOG_CATEGORIES.map((category) => ({
    label: category.label,
    value: category.slug,
  }));
}

async function attachCommentCounts(rows: PostRow[]) {
  if (rows.length === 0) {
    return [];
  }

  const supabase = createClient();
  const postIds = rows.map((post) => post.id);
  const { data, error } = await supabase
    .from("comments")
    .select("post_id")
    .in("post_id", postIds);

  if (error) {
    console.error("[posts.commentCounts]", error);
  }

  const counts = new Map<string, number>();
  for (const comment of data ?? []) {
    const postId = comment.post_id as string;
    counts.set(postId, (counts.get(postId) ?? 0) + 1);
  }

  return rows.map((post) => toPostSummary(post, counts.get(post.id) ?? 0));
}

function toPostSummary(post: PostRow, commentCount: number): BlogPostSummary {
  const category = getSingleCategory(post.categories);
  const categorySlug = category?.slug ?? "life";
  const content = post.content ?? "";

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.summary ?? getExcerpt(content),
    category: getPostCategory(categorySlug),
    categoryLabel: getCategoryLabel(categorySlug, category?.name),
    categorySlug,
    date: formatDate(post.published_at ?? post.created_at),
    readTime: getReadTime(content),
    commentCount,
  };
}

function toPostDetail(post: PostRow, commentCount: number): BlogPostDetail {
  const summary = toPostSummary(post, commentCount);
  const content = post.content ?? "";

  return {
    ...summary,
    content,
    paragraphs: getIntroParagraphs(content),
    sections: getSections(content),
  };
}

function getSingleCategory(category: CategoryRow | CategoryRow[] | null) {
  return Array.isArray(category) ? category[0] : category;
}

function getPostCategory(slug: string): PostCategory {
  if (slug === "yoga") return "Yoga";
  if (slug === "finance") return "Tài chính";
  if (slug === "parenting") return "Parenting";
  return "Cuộc sống";
}

function getCategoryLabel(slug: string | null, fallback?: string | null) {
  return getBlogCategoryLabel(slug, fallback);
}

function formatDate(value: string | null) {
  if (!value) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function getReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} phút đọc`;
}

function getExcerpt(content: string) {
  const firstParagraph = content
    .split(/\n{2,}/)
    .find((line) => line.trim() && !line.trim().startsWith("##"));

  if (!firstParagraph) return "";
  return firstParagraph.trim().slice(0, 180);
}

function getIntroParagraphs(content: string) {
  const firstHeadingIndex = content.indexOf("\n## ");
  const intro = firstHeadingIndex >= 0 ? content.slice(0, firstHeadingIndex) : content;

  return intro
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function getSections(content: string) {
  return content
    .split(/\n## /)
    .slice(1)
    .map((section) => {
      const [heading = "", ...body] = section.split(/\n+/);
      return {
        heading: heading.replace(/^##\s*/, "").trim(),
        body: body.join("\n").trim(),
      };
    })
    .filter((section) => section.heading || section.body);
}
