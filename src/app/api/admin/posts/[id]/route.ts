import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { BLOG_CATEGORY_SLUGS, type BlogCategorySlug } from "@/constants/categories";
import { createClient } from "@/lib/supabase/server";
import {
  deletePostAssetsForPost,
  hasUnresolvedImageSources,
  syncPostAssetsForPost,
  type PostAssetRow,
} from "@/services/post-assets.service";

type PublishMode = "draft" | "scheduled" | "published";

type UpdatePostPayload = {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: BlogCategorySlug;
  publishMode?: PublishMode;
  scheduledAt?: string | null;
  thumbnailUrl?: string | null;
  coverAssetId?: string | null;
  contentJson?: unknown;
  uploadedAssetIds?: string[];
  tags?: string[];
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await context.params;
  const { data: post, error } = await auth.supabase
    .from("posts")
    .select(
      "id,title,slug,summary,content,content_json,published_at,status,thumbnail_url,tags,categories(slug)",
    )
    .eq(isUuid(id) ? "id" : "slug", id)
    .maybeSingle();

  if (error) {
    console.error("[admin.posts.get]", error);
    return NextResponse.json({ error: "Không thể tải bài viết." }, { status: 500 });
  }

  if (!post) {
    return NextResponse.json({ error: "Không tìm thấy bài viết." }, { status: 404 });
  }

  const { data: assets, error: assetsError } = await auth.supabase
    .from("post_assets")
    .select("id,post_id,kind,storage_path,public_url,status,created_by,created_at")
    .eq("post_id", post.id);

  if (assetsError) {
    console.error("[admin.posts.assets.get]", assetsError);
  }

  return NextResponse.json({
    post: {
      ...post,
      assets: (assets ?? []) as PostAssetRow[],
    },
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await context.params;
  const payload = (await request.json().catch(() => null)) as UpdatePostPayload | null;
  const validationError = validatePayload(payload);

  if (validationError || !payload) {
    return NextResponse.json(
      { error: validationError ?? "Dữ liệu không hợp lệ." },
      { status: 400 },
    );
  }

  const categorySlug = payload.category ?? "life";
  const { data: category, error: categoryError } = await auth.supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();

  if (categoryError || !category) {
    console.error("[admin.posts.category.update]", categoryError);
    return NextResponse.json(
      { error: "Không tìm thấy danh mục đã chọn." },
      { status: 400 },
    );
  }

  const { data: currentPost } = await auth.supabase
    .from("posts")
    .select("id,slug,thumbnail_url")
    .eq(isUuid(id) ? "id" : "slug", id)
    .maybeSingle();

  if (!currentPost) {
    return NextResponse.json({ error: "Không tìm thấy bài viết." }, { status: 404 });
  }

  const status = getPostStatus(payload.publishMode);
  const tags = normalizeTags(payload.tags);
  const thumbnailUrl =
    payload.thumbnailUrl === undefined
      ? currentPost.thumbnail_url
      : payload.thumbnailUrl;

  const { data: post, error: updateError } = await auth.supabase
    .from("posts")
    .update({
      title: payload.title!.trim(),
      content: payload.content!.trim(),
      content_json: payload.contentJson ?? null,
      summary: payload.excerpt!.trim(),
      category_id: category.id,
      thumbnail_url: thumbnailUrl,
      tags,
      status,
      published_at:
        status === "published"
          ? new Date().toISOString()
          : status === "scheduled"
            ? new Date(payload.scheduledAt!).toISOString()
            : null,
    })
    .eq("id", currentPost.id)
    .select("id, slug, status")
    .single();

  if (updateError) {
    console.error("[admin.posts.update]", updateError);
    return NextResponse.json({ error: "Không thể cập nhật bài viết." }, { status: 500 });
  }

  const assetSync = await syncPostAssetsForPost({
    supabase: auth.supabase,
    postId: currentPost.id,
    coverAssetId: payload.coverAssetId,
    contentJson: payload.contentJson,
    uploadedAssetIds: payload.uploadedAssetIds,
    userId: auth.user.id,
  });

  if (assetSync.error) {
    return NextResponse.json(
      { error: "Bai viet da cap nhat nhung khong the dong bo anh." },
      { status: 500 },
    );
  }

  revalidatePostPaths(categorySlug, post.slug);
  return NextResponse.json({ post });
}

function normalizeTags(tags: unknown) {
  if (!Array.isArray(tags)) return [];

  return Array.from(
    new Set(
      tags
        .filter((tag): tag is string => typeof tag === "string")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  ).slice(0, 12);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await context.params;
  const { data: post } = await auth.supabase
    .from("posts")
    .select("id,slug,categories(slug)")
    .eq(isUuid(id) ? "id" : "slug", id)
    .maybeSingle();

  if (!post) {
    return NextResponse.json({ error: "Không tìm thấy bài viết." }, { status: 404 });
  }

  const assetDelete = await deletePostAssetsForPost(auth.supabase, post.id);
  if (assetDelete.error) {
    return NextResponse.json(
      { error: "Khong the xoa anh cua bai viet." },
      { status: 500 },
    );
  }

  const { error } = await auth.supabase.from("posts").delete().eq("id", post.id);

  if (error) {
    console.error("[admin.posts.delete]", error);
    return NextResponse.json({ error: "Không thể xóa bài viết." }, { status: 500 });
  }

  const category = Array.isArray(post.categories) ? post.categories[0] : post.categories;
  revalidatePostPaths(category?.slug ?? "life", post.slug);
  return NextResponse.json({ ok: true });
}

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      supabase,
      user: null,
      error: NextResponse.json({ error: "Vui lòng đăng nhập." }, { status: 401 }),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("app_role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[admin.posts.auth]", profileError);
    return {
      supabase,
      user,
      error: NextResponse.json(
        { error: "Không thể kiểm tra quyền admin." },
        { status: 500 },
      ),
    };
  }

  if (profile?.app_role !== "admin") {
    return {
      supabase,
      user,
      error: NextResponse.json(
        { error: "Chỉ admin mới được thao tác bài viết." },
        { status: 403 },
      ),
    };
  }

  return { supabase, user, error: null };
}

function validatePayload(payload: UpdatePostPayload | null) {
  if (!payload) return "Dữ liệu không hợp lệ.";
  if (!payload.title?.trim()) return "Vui lòng nhập tiêu đề bài viết.";
  if (!payload.excerpt?.trim()) return "Vui lòng nhập tóm tắt bài viết.";
  if (!payload.content?.trim()) return "Vui lòng nhập nội dung bài viết.";
  if (hasUnresolvedImageSources(payload.contentJson)) {
    return "Vui long doi anh tai len xong truoc khi luu.";
  }
  if (
    typeof payload.thumbnailUrl === "string" &&
    (payload.thumbnailUrl.startsWith("data:image/") ||
      payload.thumbnailUrl.startsWith("blob:"))
  ) {
    return "Anh bia chua tai len xong.";
  }
  if (payload.category && !BLOG_CATEGORY_SLUGS.includes(payload.category)) {
    return "Danh mục không hợp lệ.";
  }
  if (
    payload.publishMode &&
    !["draft", "scheduled", "published"].includes(payload.publishMode)
  ) {
    return "Trạng thái đăng không hợp lệ.";
  }
  if (payload.publishMode === "scheduled" && !payload.scheduledAt) {
    return "Vui lòng chọn ngày giờ đăng.";
  }
  if (
    payload.publishMode === "scheduled" &&
    new Date(payload.scheduledAt!).getTime() <= Date.now()
  ) {
    return "Ngày giờ lên lịch phải nằm trong tương lai.";
  }
  return null;
}

function getPostStatus(mode: PublishMode | undefined) {
  if (mode === "published") return "published";
  if (mode === "scheduled") return "scheduled";
  return "draft";
}

function revalidatePostPaths(categorySlug: string, slug: string) {
  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/dashboard");
  revalidatePath(`/posts/${slug}`);
  revalidatePath(`/category/${categorySlug}`);
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
