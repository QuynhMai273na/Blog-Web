import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  POST_MEDIA_BUCKET,
  type PostAssetKind,
} from "@/services/post-assets.service";

const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp"];
const maxUploadBytes = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  const kind = formData?.get("kind");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Vui long chon file anh." }, { status: 400 });
  }

  if (kind !== "cover" && kind !== "inline") {
    return NextResponse.json({ error: "Loai anh khong hop le." }, { status: 400 });
  }

  if (!allowedMimeTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Chi ho tro anh JPG, PNG hoac WEBP." },
      { status: 400 },
    );
  }

  if (file.size > maxUploadBytes) {
    return NextResponse.json(
      { error: "Anh toi da 8MB." },
      { status: 400 },
    );
  }

  const extension = getImageExtension(file.type, file.name);
  const month = new Date().toISOString().slice(0, 7);
  const storagePath = `${kind}s/${month}/${crypto.randomUUID()}.${extension}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await auth.supabase.storage
    .from(POST_MEDIA_BUCKET)
    .upload(storagePath, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("[admin.uploads.storage]", uploadError);
    return NextResponse.json(
      { error: "Khong the tai anh len Storage." },
      { status: 500 },
    );
  }

  const { data: publicData } = auth.supabase.storage
    .from(POST_MEDIA_BUCKET)
    .getPublicUrl(storagePath);

  const { data: asset, error: insertError } = await auth.supabase
    .from("post_assets")
    .insert({
      kind: kind as PostAssetKind,
      storage_path: storagePath,
      public_url: publicData.publicUrl,
      status: "pending",
      created_by: auth.user.id,
    })
    .select("id, storage_path, public_url")
    .single();

  if (insertError) {
    console.error("[admin.uploads.asset]", insertError);
    await auth.supabase.storage.from(POST_MEDIA_BUCKET).remove([storagePath]);
    return NextResponse.json(
      { error: "Khong the luu thong tin anh." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    assetId: asset.id,
    url: asset.public_url,
    path: asset.storage_path,
  });
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
      error: NextResponse.json({ error: "Vui long dang nhap." }, { status: 401 }),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("app_role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[admin.uploads.auth]", profileError);
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
        { error: "Chi admin moi duoc tai anh." },
        { status: 403 },
      ),
    };
  }

  return { supabase, user, error: null };
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
