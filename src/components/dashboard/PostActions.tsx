"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ActionDialog } from "@/components/ui/ActionDialog";

type DeleteStatus = "idle" | "success" | "error";

export function PostActions({
  postId,
  slug,
  canView,
  isFeatured = false,
  className = "",
  redirectAfterDelete,
}: {
  postId: string;
  slug: string;
  canView: boolean;
  isFeatured?: boolean;
  className?: string;
  redirectAfterDelete?: string;
}) {
  const router = useRouter();
  const [featured, setFeatured] = useState(isFeatured);
  const [isUpdatingFeatured, setIsUpdatingFeatured] = useState(false);
  const [featuredMessage, setFeaturedMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<DeleteStatus>("idle");
  const [deleteMessage, setDeleteMessage] = useState("");

  function openDeleteConfirm() {
    setDeleteStatus("idle");
    setDeleteMessage("");
    setIsConfirmingDelete(true);
  }

  function closeDeleteConfirm() {
    if (isDeleting || deleteStatus === "success") return;
    setIsConfirmingDelete(false);
  }

  async function handleDelete() {
    if (isDeleting || deleteStatus === "success") return;

    setIsDeleting(true);
    setDeleteStatus("idle");
    setDeleteMessage("");

    const response = await fetch(`/api/admin/posts/${postId}`, {
      method: "DELETE",
    });
    setIsDeleting(false);

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setDeleteStatus("error");
      setDeleteMessage(result?.error ?? "Không thể xóa bài viết.");
      return;
    }

    setDeleteStatus("success");
    setDeleteMessage("Đã xóa bài viết thành công.");

    window.setTimeout(() => {
      if (redirectAfterDelete) {
        router.push(redirectAfterDelete);
      }
      router.refresh();
    }, 1400);
  }

  async function handleToggleFeatured() {
    if (isUpdatingFeatured) return;

    const nextFeatured = !featured;
    setIsUpdatingFeatured(true);
    setFeaturedMessage("");

    const response = await fetch(`/api/admin/posts/${postId}/featured`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: nextFeatured }),
    });
    setIsUpdatingFeatured(false);

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setFeaturedMessage(
        result?.error ?? "Khong the cap nhat trang thai ghim.",
      );
      return;
    }

    setFeatured(nextFeatured);
    setFeaturedMessage(nextFeatured ? "Da ghim bai viet." : "Da bo ghim.");
    router.refresh();
  }

  const dialogTone =
    deleteStatus === "success"
      ? "success"
      : deleteStatus === "error"
        ? "error"
        : "danger";
  const dialogTitle =
    deleteStatus === "success" ? "Đã xóa bài viết" : "Xác nhận xóa bài viết";
  const dialogDescription =
    deleteStatus === "success"
      ? "Danh sách bài viết đang được cập nhật."
      : "Bài viết sẽ bị xóa vĩnh viễn. Thao tác này không thể hoàn tác.";
  const dialogActions =
    deleteStatus === "success"
      ? [
          {
            label: "Đang cập nhật...",
            disabled: true,
            variant: "success" as const,
          },
        ]
      : [
          {
            label: "Hủy",
            disabled: isDeleting,
            onClick: closeDeleteConfirm,
            variant: "secondary" as const,
          },
          {
            label: isDeleting
              ? "Đang xóa..."
              : deleteStatus === "error"
                ? "Thử xóa lại"
                : "Xóa bài viết",
            type: "submit" as const,
            disabled: isDeleting,
            variant: "danger" as const,
          },
        ];

  return (
    <div className={`relative flex flex-col items-end gap-2 ${className}`}>
      <div className="flex flex-wrap justify-end gap-2">
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
          onClick={() => void handleToggleFeatured()}
          disabled={isUpdatingFeatured}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            featured
              ? "border-sand-200 bg-[#fcf5ea] text-[#b78a54] hover:bg-white"
              : "border-sage-100 bg-sage-50 text-[#64806f] hover:bg-white"
          }`}
        >
          {isUpdatingFeatured
            ? "Đang cập nhật..."
            : featured
              ? "Bỏ ghim"
              : "Ghim"}
        </button>
        <button
          type="button"
          onClick={openDeleteConfirm}
          disabled={isDeleting}
          className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-1.5 text-xs font-medium text-[#be123c] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "Đang xóa" : "Xóa"}
        </button>
      </div>
      {featuredMessage && (
        <p className="max-w-[180px] text-right text-[11px] leading-4 text-[#8a7676]">
          {featuredMessage}
        </p>
      )}

      <ActionDialog
        open={isConfirmingDelete}
        title={dialogTitle}
        description={dialogDescription}
        tone={dialogTone}
        labelledById={`delete-post-title-${postId}`}
        closeOnBackdrop={false}
        onClose={closeDeleteConfirm}
        onSubmit={(event) => {
          event.preventDefault();
          void handleDelete();
        }}
        message={
          deleteStatus === "idle"
            ? undefined
            : {
                tone: deleteStatus,
                children: deleteMessage,
              }
        }
        actions={dialogActions}
      />
    </div>
  );
}
