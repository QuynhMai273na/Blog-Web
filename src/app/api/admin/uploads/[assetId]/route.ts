import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deletePostAssetById } from "@/services/post-assets.service";

type RouteContext = {
  params: Promise<{ assetId: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { assetId } = await context.params;
  if (!isUuid(assetId)) {
    return NextResponse.json({ error: "Asset khong hop le." }, { status: 400 });
  }

  const result = await deletePostAssetById(auth.supabase, assetId);
  if (result.error) {
    return NextResponse.json(
      { error: "Khong the xoa anh." },
      { status: 500 },
    );
  }

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
      error: NextResponse.json({ error: "Vui long dang nhap." }, { status: 401 }),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("app_role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[admin.uploads.delete.auth]", profileError);
    return {
      supabase,
      error: NextResponse.json(
        { error: "Khong the kiem tra quyen admin." },
        { status: 500 },
      ),
    };
  }

  if (profile?.app_role !== "admin") {
    return {
      supabase,
      error: NextResponse.json(
        { error: "Chi admin moi duoc xoa anh." },
        { status: 403 },
      ),
    };
  }

  return { supabase, error: null };
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
