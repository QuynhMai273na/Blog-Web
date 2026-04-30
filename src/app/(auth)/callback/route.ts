import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const providerError = searchParams.get("error_description") ?? searchParams.get("error");
  const next = getSafeRedirectPath(searchParams.get("next"));

  if (providerError) {
    console.error("[auth.google.provider]", providerError);
    return redirectWithError(origin, providerError);
  }

  if (!code) {
    console.error("[auth.google.callback] Missing OAuth code");
    return redirectWithError(origin, "Khong nhan duoc ma xac thuc tu Google.");
  }

  const supabase = createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("[auth.google.exchange]", {
      name: exchangeError.name,
      message: exchangeError.message,
      status: exchangeError.status,
    });
    return redirectWithError(origin, "Khong the tao phien dang nhap Google.");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("[auth.google.user]", userError ?? "Session exists but user is empty");
    return redirectWithError(origin, "Dang nhap thanh cong nhung khong doc duoc user.");
  }

  const provider = user.app_metadata.provider;

  if (provider === "google") {
    const { error: profileError } = await supabase.rpc("ensure_google_profile");

    if (profileError) {
      console.error("[auth.google.profile]", {
        code: profileError.code,
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
      });
      return redirectWithError(origin, "Khong the luu thong tin user Google vao DB.");
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}

function redirectWithError(origin: string, message: string) {
  const url = new URL("/login", origin);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}

function getSafeRedirectPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}
