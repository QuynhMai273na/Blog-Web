import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import {
  sendNewPostNotification,
  type SubscriberNotificationResult,
} from "@/services/subscriber-notification.service";

type CategoryRelation = { slug: string | null } | Array<{ slug: string | null }> | null;

type ScheduledPostRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  published_at: string | null;
  categories: CategoryRelation;
};

type NotificationPostRow = ScheduledPostRow & {
  notify_subscribers_on_publish: boolean | null;
  subscriber_notified_at: string | null;
};

type AdminDatabase = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string | null;
          status: string | null;
          published_at: string | null;
          notify_subscribers_on_publish: boolean | null;
          subscriber_notified_at: string | null;
          subscriber_notification_error: string | null;
        };
        Insert: never;
        Update: {
          status?: string;
          subscriber_notified_at?: string | null;
          subscriber_notification_error?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type AdminSupabaseClient = SupabaseClient<AdminDatabase>;

const BATCH_SIZE = 20;

export async function GET(request: Request) {
  return handlePublishScheduledPosts(request);
}

export async function POST(request: Request) {
  return handlePublishScheduledPosts(request);
}

async function handlePublishScheduledPosts(request: Request) {
  const authError = validateCronRequest(request);
  if (authError) return authError;

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Missing Supabase admin config." },
      { status: 500 },
    );
  }

  const now = new Date().toISOString();
  const { data: duePosts, error: duePostsError } = await supabase
    .from("posts")
    .select("id,slug,title,summary,published_at,categories(slug)")
    .eq("status", "scheduled")
    .lte("published_at", now)
    .order("published_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (duePostsError) {
    console.error("[cron.posts.due]", duePostsError);
    return NextResponse.json(
      { ok: false, error: "Cannot load scheduled posts." },
      { status: 500 },
    );
  }

  const publishResults = await publishDuePosts(
    supabase,
    (duePosts ?? []) as ScheduledPostRow[],
  );
  const notificationResults = await sendPendingNotifications({
    request,
    supabase,
    now,
  });

  return NextResponse.json({
    ok: true,
    published: publishResults,
    notifications: notificationResults,
  });
}

async function publishDuePosts(
  supabase: AdminSupabaseClient,
  posts: ScheduledPostRow[],
) {
  let published = 0;
  let failed = 0;

  for (const post of posts) {
    const { data, error } = await supabase
      .from("posts")
      .update({
        status: "published",
        subscriber_notification_error: null,
      })
      .eq("id", post.id)
      .eq("status", "scheduled")
      .select("id")
      .maybeSingle();

    if (error) {
      failed += 1;
      console.error("[cron.posts.publish]", post.id, error);
      continue;
    }

    if (!data) continue;

    published += 1;
    revalidatePostPaths(getCategorySlug(post.categories), post.slug);
  }

  return { attempted: posts.length, published, failed };
}

async function sendPendingNotifications({
  request,
  supabase,
  now,
}: {
  request: Request;
  supabase: AdminSupabaseClient;
  now: string;
}) {
  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      "id,slug,title,summary,published_at,categories(slug),notify_subscribers_on_publish,subscriber_notified_at",
    )
    .eq("status", "published")
    .eq("notify_subscribers_on_publish", true)
    .is("subscriber_notified_at", null)
    .lte("published_at", now)
    .order("published_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (error) {
    console.error("[cron.posts.notifications.load]", error);
    return { attempted: 0, sent: 0, failed: 0, errors: 1 };
  }

  let sent = 0;
  let failed = 0;
  let errors = 0;

  for (const post of (posts ?? []) as NotificationPostRow[]) {
    const result = await sendNewPostNotification({
      title: post.title,
      excerpt: post.summary ?? "",
      url: new URL(`/posts/${post.slug}`, getSiteOrigin(request)).toString(),
    });

    sent += result.sent;
    failed += result.failed;

    const markResult = await markNotificationState({
      supabase,
      postId: post.id,
      result,
    });

    if (!markResult.ok) errors += 1;
  }

  return {
    attempted: (posts ?? []).length,
    sent,
    failed,
    errors,
  };
}

async function markNotificationState({
  supabase,
  postId,
  result,
}: {
  supabase: AdminSupabaseClient;
  postId: string;
  result: SubscriberNotificationResult;
}) {
  const shouldMarkComplete =
    result.sent > 0 ||
    (!result.skippedReason && result.failed === 0) ||
    result.skippedReason === "No subscribers found.";

  const { error } = await supabase
    .from("posts")
    .update({
      subscriber_notified_at: shouldMarkComplete ? new Date().toISOString() : null,
      subscriber_notification_error: shouldMarkComplete
        ? null
        : (result.skippedReason ?? `Failed to send ${result.failed} emails.`),
    })
    .eq("id", postId);

  if (error) {
    console.error("[cron.posts.notifications.mark]", postId, error);
    return { ok: false };
  }

  return { ok: true };
}

function validateCronRequest(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { ok: false, error: "Missing CRON_SECRET." },
        { status: 500 },
      );
    }

    return null;
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 },
    );
  }

  return null;
}

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return null;

  return createSupabaseClient<AdminDatabase>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function getSiteOrigin(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
}

function getCategorySlug(categories: CategoryRelation) {
  const category = Array.isArray(categories) ? categories[0] : categories;
  return category?.slug ?? "life";
}

function revalidatePostPaths(categorySlug: string, slug: string) {
  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/dashboard");
  revalidatePath(`/posts/${slug}`);
  revalidatePath(`/category/${categorySlug}`);
}
