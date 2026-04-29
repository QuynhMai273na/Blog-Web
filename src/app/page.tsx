// app/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, category, published_at")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (error) return <p>Lỗi khi tải bài viết</p>;

  return (
    <main className="max-w-2xl mx-auto py-12 px-6 font-serif bg-[#FFF8F5] min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-[#5C3347] italic">Blog</h1>
      <ul className="space-y-4">
        {posts?.map((post) => (
          <li key={post.id}>
            <a
              href={`/posts/${post.slug}`}
              className="text-[#C25E7A] hover:text-[#D4748E] text-lg font-medium transition-colors"
            >
              {post.title}
            </a>
            <p className="text-sm text-[#8A6070] mt-1">
              {post.category} ·{" "}
              {new Date(post.published_at!).toLocaleDateString("vi-VN")}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
