"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type Comment = {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
};

export function CommentSection({
  postId,
  initialCount,
  allowComments = true,
}: {
  postId: string;
  initialCount: number;
  allowComments?: boolean;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from("comments")
      .select("id,user_id,body,created_at,profiles(display_name,avatar_url)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (loadError) {
      console.error("[comments.load]", loadError);
      setError("Khong the tai binh luan.");
      return;
    }

    setComments(((data ?? []) as CommentRow[]).map(toComment));
  }, [postId, supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    supabase
      .from("comments")
      .select("id,user_id,body,created_at,profiles(display_name,avatar_url)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
      .then(({ data, error: loadError }) => {
        if (loadError) {
          console.error("[comments.load]", loadError);
          setError("Không thể tải bình luận.");
        } else {
          setComments(((data ?? []) as CommentRow[]).map(toComment));
        }
        setIsLoading(false);
      });
  }, [postId, supabase]);

  useEffect(() => {
    const channel = supabase
      .channel(`comments:${postId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        () => {
          void loadComments();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadComments, postId, supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!body.trim() || !user) return;

    setIsSubmitting(true);
    const { data, error: insertError } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: user.id,
        body: body.trim(),
        is_approved: true,
      })
      .select("id,user_id,body,created_at,profiles(display_name,avatar_url)")
      .single();
    setIsSubmitting(false);

    if (insertError) {
      console.error("[comments.insert]", insertError);
      setError("Không thể gửi bình luận. Vui lòng thử lại.");
      return;
    }

    setComments((current) => [...current, toComment(data as CommentRow)]);
    setBody("");
  }

  async function handleDelete(commentId: string) {
    const { error: deleteError } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (deleteError) {
      console.error("[comments.delete]", deleteError);
      setError("Không thể xóa bình luận này.");
      return;
    }

    setComments((current) =>
      current.filter((comment) => comment.id !== commentId),
    );
  }

  const count = isLoading ? initialCount : comments.length;

  return (
    <section className="mt-8 rounded-[32px] border border-rose-100/80 bg-white/90 p-6 shadow-[0_14px_40px_rgba(214,156,161,0.08)] md:p-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl font-normal leading-[1.4] tracking-normal text-text_primary">
          Bình luận ({count})
        </h2>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-[#fff1f2] px-3 py-2 text-sm text-[#be123c]">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-5">
        {isLoading ? (
          <p className="text-sm  text-[#8a7474]">Đang tải bình luận...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-rose-100/80 pb-5 last:border-b-0 last:pb-0"
            >
              <div className="flex gap-4">
                <div className="flex h-11 w-11 flex-none items-center justify-center overflow-hidden rounded-full border border-rose-100 bg-rose-50 text-lg font-semibold text-[#c85f70] shadow-sm">
                  {comment.profiles?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={comment.profiles.avatar_url}
                      alt={comment.profiles.display_name ?? "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitial(comment.profiles?.display_name)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[15px] font-semibold text-[#5b4242]">
                      {comment.profiles?.display_name ?? "Ẩn danh"}
                    </p>
                    {user?.id === comment.user_id && (
                      <button
                        type="button"
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs font-medium text-[#be123c] transition hover:text-[#e11d48]"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-[14px]  leading-7 text-[#7b6464]">
                    {comment.body}
                  </p>
                  <p className="mt-1 text-xs text-[#b09090]">
                    {new Date(comment.created_at).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm  text-[#8a7474]">
            Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ.
          </p>
        )}
      </div>

      {!allowComments && (
        <p className="mt-6 rounded-[18px] border border-sand-200 bg-[#fcf5ea] px-4 py-3 text-sm text-[#8a7474]">
          Bình luận đang được tắt cho bài viết này.
        </p>
      )}

      {allowComments && user ? (
        <form onSubmit={handleSubmit} className="mt-6">
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Chia sẻ cảm nghĩ của bạn..."
            className="input-field min-h-36 rounded-[24px] border-rose-200 bg-[#2f2d2b] px-5 py-4 font-serif text-[15px]  text-white shadow-[0_8px_24px_rgba(45,62,47,0.16)] placeholder:text-[#9f9592] focus:border-rose-300 focus:ring-rose-200"
          />
          <button
            type="submit"
            disabled={isSubmitting || !body.trim()}
            className={`mt-4 inline-flex items-center rounded-full px-6 py-2.5 text-[13px] font-medium shadow-sm transition-all duration-300 ${
              body.trim()
                ? "border border-rose-200 bg-white text-[#7b6262] hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-400 hover:shadow-[0_6px_16px_rgba(214,156,161,0.2)]"
                : "cursor-not-allowed border border-rose-100/50 bg-white/40 text-[#c5b4b4]"
            }`}
          >
            {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
          </button>
        </form>
      ) : allowComments ? (
        <p className="mt-6 text-sm text-[#8a6070]">
          <Link
            href="/login"
            className="font-semibold text-[#c25e7a] underline hover:text-[#d4748e]"
          >
            Đăng nhập
          </Link>{" "}
          để bình luận.
        </p>
      ) : null}
    </section>
  );
}

function getInitial(name?: string | null) {
  return name?.trim().charAt(0).toUpperCase() || "U";
}

type CommentRow = Omit<Comment, "profiles"> & {
  profiles:
    | { display_name: string | null; avatar_url: string | null }
    | Array<{ display_name: string | null; avatar_url: string | null }>
    | null;
};

function toComment(row: CommentRow): Comment {
  return {
    ...row,
    profiles: Array.isArray(row.profiles)
      ? (row.profiles[0] ?? null)
      : row.profiles,
  };
}
