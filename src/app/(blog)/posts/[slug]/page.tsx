import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";

import { getPostBySlug, getRelatedPosts } from "@/services/post.service";
import { BuyMeCoffeeCard } from "@/components/blog/BuyMeCoffeeCard";
import { CommentSection } from "@/components/blog/CommentSection";
import { PostActions } from "@/components/dashboard/PostActions";
import { createClient } from "@/lib/supabase/server";

type PostDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PostDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Bài viết không tồn tại | Becoming Blooming",
    };
  }

  return {
    title: `${post.title} | Becoming Blooming`,
    description: post.excerpt,
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [relatedPosts, isAdmin] = await Promise.all([
    getRelatedPosts(post),
    getIsAdmin(),
  ]);

  return (
    <div className="relative isolate animate-bloom pb-10 md:pb-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(252,228,230,0.72),transparent_34%),radial-gradient(circle_at_top_right,rgba(209,231,221,0.42),transparent_30%),linear-gradient(180deg,#fcfaf5_0%,#f8f1e7_48%,#fcfaf6_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-24 -z-10 h-56 w-56 rounded-full bg-rose-100/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-20 right-0 -z-10 h-72 w-72 rounded-full bg-sage-100/50 blur-3xl"
      />

      <section className="border-b border-rose-100/80 bg-white/95 px-4 py-4 shadow-[0_12px_40px_rgba(45,62,47,0.04)] backdrop-blur-sm md:px-6 md:py-6">
        <div className="mx-auto max-w-6xl">
          <div className="animate-bloom [animation-delay:120ms] [animation-fill-mode:both]">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-5 py-2.5 text-[13px] font-medium text-[#7b6262] shadow-[0_10px_26px_rgba(214,156,161,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại bài viết
            </Link>
          </div>

          <header className="mx-auto  max-w-4xl text-center animate-bloom [animation-delay:180ms] [animation-fill-mode:both]">
            <span className="inline-flex rounded-full border border-sage-100 bg-sage-50 px-4 py-1.5 text-[12px] font-medium text-[#6c8f7a] shadow-sm">
              {post.categoryLabel}
            </span>
            <h1 className="mx-auto mt-6 max-w-4xl font-serif text-[2.5rem] font-normal leading-[1.4] tracking-normal text-[#3d2f2f] md:text-[36px]">
              {post.title}
            </h1>
            <div className="mt-6 text-[12px] font-medium tracking-[0.08em] text-[#9b8888] md:text-[13px]">
              {post.date}
              <span className="mx-2">•</span>
              {post.readTime}
              <span className="mx-2">•</span>
              {post.commentCount} bình luận
            </div>
            {isAdmin && (
              <PostActions
                postId={post.id}
                slug={post.slug}
                canView={false}
                redirectAfterDelete="/posts"
                className="mt-6 justify-center"
              />
            )}
          </header>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-10 md:px-6 md:pt-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="relative overflow-hidden rounded-[36px] border border-white/90 bg-[#fffefd]/95 p-7 shadow-[0_30px_90px_rgba(45,62,47,0.12),0_10px_28px_rgba(168,198,159,0.12)] ring-1 ring-rose-100/70 backdrop-blur-md animate-bloom [animation-delay:260ms] [animation-fill-mode:both] md:p-10">
            <div
              aria-hidden
              className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-white/85 via-transparent to-rose-50/35"
            />

            <div className="relative">
              {post.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mb-5 text-base text-[#6a5555] ">
                  {paragraph}
                </p>
              ))}

              <blockquote className="mt-8 rounded-[24px] border-l-4 border-rose-300 bg-gradient-to-r from-rose-50 to-rose-50/35 px-6 py-5 font-serif text-lg italic tracking-normal text-[#9a6570] ">
                {post.excerpt}
              </blockquote>

              <div className="mt-10 space-y-10">
                {post.sections.map((section) => (
                  <section key={section.heading}>
                    <h2 className="font-sans text-lg font-semibold  text-text_primary">
                      {section.heading}
                    </h2>
                    <p className="mt-3 whitespace-pre-line text-base  text-text_secondary">
                      {section.body}
                    </p>
                  </section>
                ))}
              </div>

              <div className="mt-4 border-t border-rose-100/80 pt-6 text-[15px] leading-7 text-[#8a7a7a] md:text-base">
                <span>Filed Under: </span>
                <Link
                  href={`/category/${post.categorySlug}`}
                  className="font-medium transition-colors duration-300 hover:text-rose-400"
                >
                  {post.categoryLabel}
                </Link>
              </div>

              <CommentSection
                postId={post.id}
                initialCount={post.commentCount}
              />
            </div>
          </article>

          <aside className="space-y-5 animate-bloom [animation-delay:340ms] [animation-fill-mode:both]">
            <div className="relative overflow-hidden rounded-[30px] border border-white/90 bg-[#fffdfb]/95 p-6 text-center shadow-[0_24px_70px_rgba(45,62,47,0.1)] ring-1 ring-rose-100/70 backdrop-blur-md">
              <div
                aria-hidden
                className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-white/80 via-transparent to-rose-50/30"
              />
              <div className="relative">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-3xl shadow-sm">
                  🌸
                </div>
                <h3 className="font-serif text-[1.7rem] font-semibold  text-[#4a3737]">
                  Becoming Blooming
                </h3>
                <p className="mt-3 text-[14px]  leading-7 text-[#8a7474]">
                  Hãy đăng ký email của bạn để nhận thông báo về bài viết mới
                  nhất.
                </p>
                {/* Thêm input email */}
                <div className="mt-6">
                  <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    required
                    className="w-full rounded-[18px] border border-rose-100 bg-white px-4 py-3 text-[13px] font-medium text-[#9a6570] shadow-sm placeholder:text-[#9a6570] transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                  />
                </div>
                <button
                  type="button"
                  className="mt-6 rounded-[18px] border border-rose-100 bg-rose-200 px-4 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-rose-300 hover:border-rose-300 hover:text-text_secondary"
                >
                  Đăng ký
                </button>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/90 bg-[#fffefd]/95 p-6 shadow-[0_24px_70px_rgba(45,62,47,0.1)] ring-1 ring-rose-100/70 backdrop-blur-md">
              <h3 className="border-b border-rose-100 pb-3 font-serif text-2xl font-normal leading-[1.4] tracking-normal text-text_primary">
                Bài viết liên quan
              </h3>
              <div className="mt-4 space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/posts/${relatedPost.slug}`}
                    className="group block border-b border-rose-100/80 pb-4 last:border-b-0 last:pb-0"
                  >
                    <p className="font-serif text-[15px]  leading-7 text-[#6c5555] transition-colors duration-300 group-hover:text-rose-400">
                      {relatedPost.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/90 bg-[#fffefd]/95 p-6 shadow-[0_24px_70px_rgba(45,62,47,0.1)] ring-1 ring-rose-100/70 backdrop-blur-md">

              <h3 className="border-b border-rose-100 pb-3 font-serif text-2xl font-normal leading-[1.4] tracking-normal text-text_primary">
                Tags   
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.length > 0 ? (
                  post.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className={`rounded-full border px-3 py-1 text-[12px] font-medium shadow-sm ${
                        index % 3 === 0
                          ? "border-rose-100 bg-rose-50 text-[#c27d85]"
                          : index % 3 === 1
                            ? "border-sage-100 bg-sage-50 text-[#6c8f7a]"
                            : "border-sand-200 bg-[#fcf5ea] text-[#b78a54]"
                      }`}
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <p className="text-[13px] text-[#9b8888]">Chưa có tag</p>
                )}
              </div>
            </div>
            <BuyMeCoffeeCard />
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/90 px-4 py-2 text-[13px] font-medium text-[#6f5a5a] shadow-[0_10px_26px_rgba(214,156,161,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-400"
            >
              Xem tất cả bài viết
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}

async function getIsAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("app_role")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.app_role === "admin";
}
