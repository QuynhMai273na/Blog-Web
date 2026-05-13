import { createClient } from "@/lib/supabase/client";

export type SubscribeEmailStatus =
  | "success"
  | "duplicate"
  | "invalid"
  | "error";

type SubscribeEmailResult = {
  status: SubscribeEmailStatus;
  error?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeEmail(
  email: string,
): Promise<SubscribeEmailResult> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return {
      status: "invalid",
      error: "Email không hợp lệ.",
    };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("subscribers")
    .insert({ email: normalizedEmail });

  if (!error) {
    return { status: "success" };
  }

  if (error.code === "23505") {
    return { status: "duplicate" };
  }

  console.error("[subscribe]", error);
  return {
    status: "error",
    error: "Chưa thể đăng ký email. Vui lòng thử lại sau.",
  };
}
