"use client";
// components/CommentSection.tsx
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Comment = {
  id: string;
  body: string;
  created_at: string;
  profiles: { display_name: string; avatar_url: string } | null;
};

export function CommentSection({ postId }: { postId: string }) {
  const supabase = createClient();
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load user hiện tại
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // Load comments ban đầu
  useEffect(() => {
    supabase
      .from("comments")
      .select("*, profiles(display_name, avatar_url)")
      .eq("post_id", postId)
      .order("created_at")
      .then(({ data }) => setComments(data ?? []));
  }, [postId]);

  // Realtime — comment mới hiện ngay không cần reload
  useEffect(() => {
    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        async (payload) => {
          // Fetch thêm profile info cho comment mới
          const { data } = await supabase
            .from("comments")
            .select("*, profiles(display_name, avatar_url)")
            .eq("id", payload.new.id)
            .single();
          if (data) setComments((prev) => [...prev, data]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  // Gửi comment
  async function handleSubmit() {
    if (!body.trim() || !user) return;
    setLoading(true);
    await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      body: body.trim(),
    });
    setBody("");
    setLoading(false);
  }

  // Xóa comment (RLS tự chặn nếu không phải owner)
  async function handleDelete(commentId: string) {
    await supabase.from("comments").delete().eq("id", commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-6 text-[#5C3347] italic">
        Bình luận ({comments.length})
      </h2>

      {/* Danh sách comment */}
      <ul className="space-y-6 mb-8">
        {comments.map((c) => (
          <li
            key={c.id}
            className="flex gap-3 p-4 rounded-2xl bg-white border border-[#F2D4DC]"
          >
            {c.profiles?.avatar_url && (
              <img
                src={c.profiles.avatar_url}
                className="w-9 h-9 rounded-full ring-2 ring-[#F2D4DC]"
                alt=""
              />
            )}
            <div className="flex-1">
              <p className="font-medium text-sm text-[#5C3347]">
                {c.profiles?.display_name ?? "Ẩn danh"}
              </p>
              <p className="text-[#5C3347] mt-1 leading-relaxed">{c.body}</p>
              <p className="text-xs text-[#B8A0AC] mt-1">
                {new Date(c.created_at).toLocaleString("vi-VN")}
              </p>
            </div>
            {user && (c as any).user_id === user.id && (
              <button
                onClick={() => handleDelete(c.id)}
                className="text-[#D4748E] hover:text-[#C25E7A] text-xs self-start transition-colors"
              >
                Xóa
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Form gửi comment */}
      {user ? (
        <div className="space-y-3 p-4 rounded-2xl bg-white border border-[#F2D4DC]">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Viết bình luận..."
            className="w-full border border-[#E8B8C8] rounded-xl p-3 text-sm resize-none h-24 bg-[#FFF8F5] text-[#5C3347] placeholder:text-[#C8A0B0] focus:outline-none focus:ring-2 focus:ring-[#D4748E]/30"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !body.trim()}
            className="px-6 py-2.5 bg-[#C25E7A] hover:bg-[#D4748E] text-white rounded-full text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Đang gửi..." : "Gửi bình luận"}
          </button>
        </div>
      ) : (
        <p className="text-[#8A6070] text-sm">
          <a
            href="/auth/login"
            className="text-[#C25E7A] underline hover:text-[#D4748E]"
          >
            Đăng nhập
          </a>{" "}
          để bình luận
        </p>
      )}
    </section>
  );
}
