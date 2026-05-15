import { createClient as createSupabaseClient } from "@supabase/supabase-js";

type NotifyPostInput = {
  title: string;
  excerpt: string;
  url: string;
};

export type SubscriberNotificationResult = {
  requested: boolean;
  sent: number;
  failed: number;
  skippedReason?: string;
};

type SubscriberRow = {
  email: string | null;
};

const RESEND_EMAIL_ENDPOINT = "https://api.resend.com/emails";
const SEND_CONCURRENCY = 8;

export async function sendNewPostNotification(
  post: NotifyPostInput,
): Promise<SubscriberNotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_EMAIL_FROM;

  if (!apiKey || !from) {
    return {
      requested: true,
      sent: 0,
      failed: 0,
      skippedReason: "Missing RESEND_API_KEY or CONTACT_EMAIL_FROM.",
    };
  }

  const subscribers = await getSubscriberEmails();

  if (subscribers.length === 0) {
    return {
      requested: true,
      sent: 0,
      failed: 0,
      skippedReason: "No subscribers found.",
    };
  }

  let sent = 0;
  let failed = 0;

  for (let index = 0; index < subscribers.length; index += SEND_CONCURRENCY) {
    const batch = subscribers.slice(index, index + SEND_CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map((email) =>
        sendEmailToSubscriber({ apiKey, from, to: email, post }),
      ),
    );

    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        sent += 1;
      } else {
        failed += 1;
      }
    }
  }

  return { requested: true, sent, failed };
}

async function getSubscriberEmails() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "[subscriber.notify.config]",
      "Missing Supabase admin config.",
    );
    return [];
  }

  const supabase = createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase
    .from("subscribers")
    .select("email")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[subscriber.notify.list]", error);
    return [];
  }

  return Array.from(
    new Set(
      ((data ?? []) as SubscriberRow[])
        .map((subscriber) => subscriber.email?.trim().toLowerCase())
        .filter((email): email is string => Boolean(email)),
    ),
  );
}

async function sendEmailToSubscriber({
  apiKey,
  from,
  to,
  post,
}: {
  apiKey: string;
  from: string;
  to: string;
  post: NotifyPostInput;
}) {
  const response = await fetch(RESEND_EMAIL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `[Becoming Blooming] Bài viết mới: ${post.title}`,
      text: buildTextEmail(post),
      html: buildHtmlEmail(post),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("[subscriber.notify.send]", response.status, to, errorText);
    return false;
  }

  return true;
}

function buildTextEmail(post: NotifyPostInput) {
  return [
    "Becoming Blooming vừa đăng bài viết mới.",
    "",
    post.title,
    "",
    post.excerpt,
    "",
    `Đọc bài viết: ${post.url}`,
  ].join("\n");
}

function buildHtmlEmail(post: NotifyPostInput) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#3a2520">
      <p style="margin:0 0 12px;color:#9a6570">Becoming Blooming vừa đăng bài viết mới.</p>
      <h1 style="margin:0 0 16px;font-size:28px;line-height:1.25;color:#402f2f">${escapeHtml(post.title)}</h1>
      <p style="margin:0 0 24px;color:#6a5555">${escapeHtml(post.excerpt)}</p>
      <a href="${escapeHtml(post.url)}" style="display:inline-block;border-radius:999px;background:#d96e83;color:#fff;padding:12px 20px;text-decoration:none;font-weight:700">Đọc bài viết</a>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
