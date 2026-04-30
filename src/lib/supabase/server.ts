import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
        async set(name, value, options) {
          (await cookieStore).set({ name, value, ...options });
        },
        async remove(name, options) {
          (await cookieStore).set({ name, value: "", ...options });
        },
      },
    },
  );
}
