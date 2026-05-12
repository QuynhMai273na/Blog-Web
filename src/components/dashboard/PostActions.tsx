"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PostActions({
  postId,
  slug,
  canView,
  className = "",
  redirectAfterDelete,
}: {
  postId: string;
  slug: string;
  canView: boolean;
  className?: string;
  redirectAfterDelete?: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Xóa bài viết này? Thao tác này không thể hoàn tác.");
    if (!confirmed) return;

    setIsDeleting(true);
    const response = await fetch(`/api/admin/posts/${postId}`, {
      method: "DELETE",
    });
    setIsDeleting(false);

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      window.alert(result?.error ?? "Không thể xóa bài viết.");
      return;
    }

    if (redirectAfterDelete) {
      router.push(redirectAfterDelete);
      router.refresh();
      return;
    }

    router.refresh();
  }

  return (
    <div className={`flex justify-end gap-2 ${className}`}>
      {canView && (
        <Link
          href={`/posts/${slug}`}
          className="rounded-lg border border-[#e5e5e5] px-3 py-1.5 text-xs font-medium text-[#7a5a55] transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          Xem
        </Link>
      )}
      <Link
        href={`/dashboard/write?edit=${slug}`}
        className="rounded-lg border border-sage-100 bg-sage-50 px-3 py-1.5 text-xs font-medium text-[#64806f] transition-colors hover:bg-white"
      >
        Sửa
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-1.5 text-xs font-medium text-[#be123c] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? "Đang xóa" : "Xóa"}
      </button>
    </div>
  );
}
