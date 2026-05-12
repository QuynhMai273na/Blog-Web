import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { BLOG_CATEGORY_SLUGS, type BlogCategorySlug } from "@/constants/categories";
import { createClient } from "@/lib/supabase/server";

type PublishMode = "draft" | "scheduled" | "published";

type UpdatePostPayload = {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: BlogCategorySlug;
  publishMode?: PublishMode;
  scheduledAt?: string | null;
  coverImage?: string | null;
  coverFileName?: string;
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
      "id,title,slug,summary,content,published_at,status,thumbnail_url,tags,categories(slug)",
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

  return NextResponse.json({ post });
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
  const thumbnailUrl = await uploadCoverImage({
    supabase: auth.supabase,
    slug: currentPost.slug,
    coverImage: payload.coverImage,
    coverFileName: payload.coverFileName,
  });

  const { data: post, error: updateError } = await auth.supabase
    .from("posts")
    .update({
      title: payload.title!.trim(),
      content: payload.content!.trim(),
      summary: payload.excerpt!.trim(),
      category_id: category.id,
      thumbnail_url: thumbnailUrl ?? currentPost.thumbnail_url,
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
      error: NextResponse.json(
        { error: "Không thể kiểm tra quyền admin." },
        { status: 500 },
      ),
    };
  }

  if (profile?.app_role !== "admin") {
    return {
      supabase,
      error: NextResponse.json(
        { error: "Chỉ admin mới được thao tác bài viết." },
        { status: 403 },
      ),
    };
  }

  return { supabase, error: null };
}

function validatePayload(payload: UpdatePostPayload | null) {
  if (!payload) return "Dữ liệu không hợp lệ.";
  if (!payload.title?.trim()) return "Vui lòng nhập tiêu đề bài viết.";
  if (!payload.excerpt?.trim()) return "Vui lòng nhập tóm tắt bài viết.";
  if (!payload.content?.trim()) return "Vui lòng nhập nội dung bài viết.";
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

async function uploadCoverImage({
  supabase,
  slug,
  coverImage,
  coverFileName,
}: {
  supabase: ReturnType<typeof createClient>;
  slug: string;
  coverImage?: string | null;
  coverFileName?: string;
}) {
  if (!coverImage?.startsWith("data:image/")) return null;

  const match = coverImage.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;

  const [, contentType, base64] = match;
  const extension = getImageExtension(contentType, coverFileName);
  const bytes = Uint8Array.from(Buffer.from(base64, "base64"));
  const path = `${slug}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from("post-covers")
    .upload(path, bytes, {
      contentType,
      upsert: false,
    });

  if (error) {
    console.error("[admin.posts.cover.update]", error);
    return null;
  }

  const { data } = supabase.storage.from("post-covers").getPublicUrl(path);
  return data.publicUrl;
}

function getImageExtension(contentType: string, fileName?: string) {
  const existingExtension = fileName?.split(".").pop()?.toLowerCase();
  if (existingExtension && ["jpg", "jpeg", "png", "webp"].includes(existingExtension)) {
    return existingExtension === "jpeg" ? "jpg" : existingExtension;
  }

  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
