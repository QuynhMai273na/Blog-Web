import { createClient } from "@/lib/supabase/client";

export async function signInWithGoogle() {
  const supabase = createClient();
  const redirectTo = `${window.location.origin}/callback`;

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });
}
