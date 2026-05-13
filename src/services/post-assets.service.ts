import { createClient } from "@/lib/supabase/server";

export const POST_MEDIA_BUCKET = "post-media";

export type PostAssetKind = "cover" | "inline";
export type PostAssetStatus = "pending" | "attached";

export type PostAssetRow = {
  id: string;
  post_id: string | null;
  kind: PostAssetKind;
  storage_path: string;
  public_url: string;
  status: PostAssetStatus;
  created_by: string | null;
  created_at?: string | null;
};

type SupabaseServerClient = ReturnType<typeof createClient>;

export function extractAssetIdsFromContentJson(contentJson: unknown) {
  const ids = new Set<string>();

  function visit(node: unknown) {
    if (!node || typeof node !== "object") return;

    const item = node as {
      type?: string;
      attrs?: { assetId?: unknown };
      content?: unknown[];
    };

    if (item.type === "image" && typeof item.attrs?.assetId === "string") {
      ids.add(item.attrs.assetId);
    }

    for (const child of item.content ?? []) {
      visit(child);
    }
  }

  visit(contentJson);
  return ids;
}

export function hasUnresolvedImageSources(contentJson: unknown) {
  let hasUnresolved = false;

  function visit(node: unknown) {
    if (hasUnresolved || !node || typeof node !== "object") return;

    const item = node as {
      type?: string;
      attrs?: { src?: unknown; tempId?: unknown };
      content?: unknown[];
    };

    if (item.type === "image") {
      const src = typeof item.attrs?.src === "string" ? item.attrs.src : "";
      if (
        src.startsWith("blob:") ||
        src.startsWith("data:image/") ||
        typeof item.attrs?.tempId === "string"
      ) {
        hasUnresolved = true;
        return;
      }
    }

    for (const child of item.content ?? []) {
      visit(child);
    }
  }

  visit(contentJson);
  return hasUnresolved;
}

export async function syncPostAssetsForPost({
  supabase,
  postId,
  coverAssetId,
  contentJson,
  uploadedAssetIds,
  userId,
}: {
  supabase: SupabaseServerClient;
  postId: string;
  coverAssetId?: string | null;
  contentJson: unknown;
  uploadedAssetIds?: string[];
  userId: string;
}) {
  const usedAssetIds = extractAssetIdsFromContentJson(contentJson);
  if (coverAssetId) usedAssetIds.add(coverAssetId);

  const { data: attachedAssets, error: attachedError } = await supabase
    .from("post_assets")
    .select("id,post_id,kind,storage_path,public_url,status,created_by,created_at")
    .eq("post_id", postId);

  if (attachedError) {
    console.error("[post.assets.attached]", attachedError);
    return { error: attachedError };
  }

  const obsoleteAttachedAssets = ((attachedAssets ?? []) as PostAssetRow[]).filter(
    (asset) => !usedAssetIds.has(asset.id),
  );

  await deletePostAssetsByRows(supabase, obsoleteAttachedAssets);

  const usedIds = Array.from(usedAssetIds);
  if (usedIds.length > 0) {
    const { error: attachError } = await supabase
      .from("post_assets")
      .update({ post_id: postId, status: "attached" })
      .in("id", usedIds);

    if (attachError) {
      console.error("[post.assets.attach]", attachError);
      return { error: attachError };
    }
  }

  const staleUploadedIds = Array.from(
    new Set((uploadedAssetIds ?? []).filter((id) => !usedAssetIds.has(id))),
  );

  if (staleUploadedIds.length > 0) {
    const { data: staleAssets, error: staleError } = await supabase
      .from("post_assets")
      .select("id,post_id,kind,storage_path,public_url,status,created_by,created_at")
      .in("id", staleUploadedIds)
      .eq("status", "pending")
      .eq("created_by", userId);

    if (staleError) {
      console.error("[post.assets.stale]", staleError);
      return { error: staleError };
    }

    await deletePostAssetsByRows(supabase, (staleAssets ?? []) as PostAssetRow[]);
  }

  return { error: null };
}

export async function deletePostAssetsForPost(
  supabase: SupabaseServerClient,
  postId: string,
) {
  const { data, error } = await supabase
    .from("post_assets")
    .select("id,post_id,kind,storage_path,public_url,status,created_by,created_at")
    .eq("post_id", postId);

  if (error) {
    console.error("[post.assets.forPost]", error);
    return { error };
  }

  await deletePostAssetsByRows(supabase, (data ?? []) as PostAssetRow[]);
  return { error: null };
}

export async function deletePostAssetById(
  supabase: SupabaseServerClient,
  assetId: string,
) {
  const { data, error } = await supabase
    .from("post_assets")
    .select("id,post_id,kind,storage_path,public_url,status,created_by,created_at")
    .eq("id", assetId)
    .maybeSingle();

  if (error) {
    console.error("[post.assets.get]", error);
    return { error };
  }

  if (!data) {
    return { error: null };
  }

  await deletePostAssetsByRows(supabase, [data as PostAssetRow]);
  return { error: null };
}

async function deletePostAssetsByRows(
  supabase: SupabaseServerClient,
  assets: PostAssetRow[],
) {
  if (assets.length === 0) return;

  const paths = assets.map((asset) => asset.storage_path).filter(Boolean);
  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(POST_MEDIA_BUCKET)
      .remove(paths);

    if (storageError) {
      console.error("[post.assets.storage.remove]", storageError);
    }
  }

  const ids = assets.map((asset) => asset.id);
  const { error: deleteError } = await supabase
    .from("post_assets")
    .delete()
    .in("id", ids);

  if (deleteError) {
    console.error("[post.assets.delete]", deleteError);
  }
}
