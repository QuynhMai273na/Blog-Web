import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type FeaturedPayload = {
  featured?: boolean;
};

type CategoryRow = {
  slug: string | null;
};

type CurrentPostRow = {
  id: string;
  slug: string;
  is_featured: boolean | null;
  featured_at: string | null;
  categories: CategoryRow | CategoryRow[] | null;
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const payload = (await request.json().catch(() => null)) as
    | FeaturedPayload
    | null;

  if (typeof payload?.featured !== "boolean") {
    return NextResponse.json(
      { error: "Trang thai ghim khong hop le." },
      { status: 400 },
    );
  }

  const { id } = await context.params;
  const { data: currentPost, error: currentPostError } = await auth.supabase
    .from("posts")
    .select("id,slug,is_featured,featured_at,categories(slug)")
    .eq(isUuid(id) ? "id" : "slug", id)
    .maybeSingle();

  if (currentPostError) {
    console.error("[admin.posts.featured.get]", currentPostError);
    return NextResponse.json(
      { error: "Khong the tai bai viet." },
      { status: 500 },
    );
  }

  if (!currentPost) {
    return NextResponse.json(
      { error: "Khong tim thay bai viet." },
      { status: 404 },
    );
  }

  const post = currentPost as CurrentPostRow;
  const featuredAt = payload.featured
    ? post.is_featured
      ? (post.featured_at ?? new Date().toISOString())
      : new Date().toISOString()
    : null;

  const { data: updatedPost, error: updateError } = await auth.supabase
    .from("posts")
    .update({
      is_featured: payload.featured,
      featured_at: featuredAt,
    })
    .eq("id", post.id)
    .select("id,slug,is_featured,featured_at")
    .single();

  if (updateError) {
    console.error("[admin.posts.featured.update]", updateError);
    return NextResponse.json(
      { error: "Khong the cap nhat trang thai ghim." },
      { status: 500 },
    );
  }

  const category = Array.isArray(post.categories)
    ? post.categories[0]
    : post.categories;
  revalidatePostPaths(category?.slug ?? "life", post.slug);

  return NextResponse.json({ post: updatedPost });
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
      error: NextResponse.json(
        { error: "Vui long dang nhap." },
        { status: 401 },
      ),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("app_role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[admin.posts.featured.auth]", profileError);
    return {
      supabase,
      user,
      error: NextResponse.json(
        { error: "Khong the kiem tra quyen admin." },
        { status: 500 },
      ),
    };
  }

  if (profile?.app_role !== "admin") {
    return {
      supabase,
      user,
      error: NextResponse.json(
        { error: "Chi admin moi duoc thao tac bai viet." },
        { status: 403 },
      ),
    };
  }

  return { supabase, user, error: null };
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
