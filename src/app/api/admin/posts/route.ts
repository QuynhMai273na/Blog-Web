import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { BLOG_CATEGORY_SLUGS, type BlogCategorySlug } from "@/constants/categories";

type PublishMode = "draft" | "scheduled" | "published";

type CreatePostPayload = {
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

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Vui lòng đăng nhập." }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("app_role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[admin.posts.profile]", profileError);
    return NextResponse.json(
      { error: "Không thể kiểm tra quyền admin." },
      { status: 500 },
    );
  }

  if (profile?.app_role !== "admin") {
    return NextResponse.json(
      { error: "Chỉ admin mới được tạo bài viết." },
      { status: 403 },
    );
  }

  const payload = (await request.json().catch(() => null)) as CreatePostPayload | null;
  const validationError = validatePayload(payload);

  if (validationError || !payload) {
    return NextResponse.json(
      { error: validationError ?? "Dữ liệu không hợp lệ." },
      { status: 400 },
    );
  }

  const categorySlug = payload.category ?? "life";
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();

  if (categoryError || !category) {
    console.error("[admin.posts.category]", categoryError);
    return NextResponse.json(
      { error: "Không tìm thấy danh mục đã chọn." },
      { status: 400 },
    );
  }

  const slug = await createUniqueSlug(supabase, payload.title!.trim());
  const status = getPostStatus(payload.publishMode);
  const tags = normalizeTags(payload.tags);
  const thumbnailUrl = await uploadCoverImage({
    supabase,
    slug,
    coverImage: payload.coverImage,
    coverFileName: payload.coverFileName,
  });

  const { data: post, error: insertError } = await supabase
    .from("posts")
    .insert({
      title: payload.title!.trim(),
      slug,
      content: payload.content!.trim(),
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
    .select("id, slug, status")
    .single();

  if (insertError) {
    console.error("[admin.posts.insert]", insertError);
    return NextResponse.json(
      { error: "Không thể lưu bài viết. Kiểm tra RLS hoặc schema Supabase." },
      { status: 500 },
    );
  }

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/dashboard");
  revalidatePath(`/category/${categorySlug}`);

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

function validatePayload(payload: CreatePostPayload | null) {
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

async function createUniqueSlug(
  supabase: ReturnType<typeof createClient>,
  title: string,
) {
  const baseSlug = slugify(title) || `post-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const { data, error } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("[admin.posts.slug]", error);
      return `${baseSlug}-${Date.now()}`;
    }

    if (!data) return slug;

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
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
    console.error("[admin.posts.cover]", error);
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
