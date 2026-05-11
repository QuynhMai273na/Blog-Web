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
          try {
            (await cookieStore).set({ name, value, ...options });
          } catch {
            // Server Components can read cookies but cannot write them.
            // Session refresh cookie writes are handled by middleware.
          }
        },
        async remove(name, options) {
          try {
            (await cookieStore).set({ name, value: "", ...options });
          } catch {
            // Server Components can read cookies but cannot write them.
            // Session refresh cookie writes are handled by middleware.
          }
        },
      },
    },
  );
}
