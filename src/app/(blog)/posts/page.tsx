import PostCard from "@/components/blog/PostCard";
import { posts } from "@/lib/posts";

export default function PostsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-bloom">
      <header className="mb-12 border-b border-rose-100 pb-8">
        <h1 className="text-4xl font-serif text-sage-800 mb-3">
          Tất cả bài viết ✍️
        </h1>
        <p className="text-sage-800/60 text-sm">
          Những câu chuyện từ hành trình phát triển bản thân của mình
        </p>
      </header>

      {/* Filter / Search Bar */}
      <div className="flex gap-4 mb-10">
        <div className="w-12 h-12 bg-sage-800 rounded-xl flex items-center justify-center text-white">
          🔍
        </div>
        <select className="flex-1 input-field border-rose-100 text-sage-800/70 bg-white">
          <option>Tất cả chủ đề</option>
          <option>Parenting</option>
          <option>Yoga & Sức khỏe</option>
          <option>Tài chính</option>
        </select>
      </div>

      {/* Danh sách bài viết (Layout ngang) */}
      <div className="space-y-6 mb-16">
        {posts.map((post) => (
          <PostCard key={post.slug} {...post} horizontal={true} />
        ))}
      </div>

      {/* Phân trang (Pagination) */}
      <div className="flex justify-center items-center gap-3 text-sm">
        <button className="px-4 py-2 rounded-full border border-rose-100 text-sage-800/40 hover:bg-rose-50 transition-colors">
          ← Trước
        </button>
        <button className="w-10 h-10 rounded-full bg-rose-200 text-white font-bold shadow-md">
          1
        </button>
        <button className="w-10 h-10 rounded-full border border-rose-100 text-sage-800 hover:bg-rose-50 transition-colors">
          2
        </button>
        <button className="px-4 py-2 rounded-full border border-rose-100 text-sage-800 hover:bg-rose-50 transition-colors">
          Sau →
        </button>
      </div>
    </div>
  );
}
