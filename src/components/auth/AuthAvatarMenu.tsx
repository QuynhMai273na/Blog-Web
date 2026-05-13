"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { LayoutDashboard, LogOut, PenLine, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/services/auth.service";

type Profile = {
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  app_role: string | null;
};

export default function AuthAvatarMenu() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);

  async function loadProfile(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, avatar_url, email, app_role")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("[auth.profile.load]", error);
      return;
    }

    setProfile(data);
  }

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsLoading(false);
      if (data.user) {
        void loadProfile(data.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      setProfile(null);
      if (nextUser) {
        void loadProfile(nextUser.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const avatarUrl = profile?.avatar_url ?? user?.user_metadata.avatar_url;
  const canShowAvatar = Boolean(avatarUrl && failedAvatarUrl !== avatarUrl);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const { error } = await signOut();
    setIsSigningOut(false);

    if (error) {
      console.error("[auth.signout]", error);
      return;
    }

    setIsOpen(false);
    setUser(null);
    setProfile(null);
    router.push("/");
    router.refresh();
  };

  if (isLoading) {
    return <div className="h-9 w-[92px]" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-lg border border-[#efc7cc] bg-white px-4 py-1.5 font-sans text-sm font-semibold text-[#c85f70] shadow-sm transition-all hover:border-[#d96e83] hover:bg-[#fff5f6] hover:text-[#a94556]"
      >
        Đăng nhập
      </Link>
    );
  }

  const displayName =
    profile?.display_name ??
    user.user_metadata.full_name ??
    user.user_metadata.name ??
    user.email ??
    "User";
  const email = profile?.email ?? user.email;
  const isAdmin = profile?.app_role === "admin";

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[#efc7cc] bg-[#fff5f6] text-sm font-semibold text-[#c85f70] shadow-sm transition hover:border-[#d96e83]"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Mở menu tài khoản"
      >
        {canShowAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={displayName}
            referrerPolicy="no-referrer"
            onError={() => setFailedAvatarUrl(avatarUrl ?? null)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{getInitial(displayName)}</span>
        )}
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-[#ead9d3] bg-white py-2 text-left shadow-[0_12px_32px_rgba(74,44,42,0.16)]"
        >
          <div className="border-b border-[#f0e6e0] px-4 pb-3 pt-2">
            <p className="truncate font-sans text-sm font-semibold text-[#3a2520]">
              {displayName}
            </p>
            {email && (
              <p className="mt-0.5 truncate font-sans text-xs text-[#9b7f79]">
                {email}
              </p>
            )}
          </div>
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 font-sans text-sm text-[#667568] transition hover:bg-[#fff5f6] hover:text-[#c85f70]"
          >
            <UserRound className="h-4 w-4" aria-hidden="true" />
            My profile
          </Link>
          {isAdmin && (
            <Link
              href="/dashboard/write"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 font-sans text-sm font-semibold text-[#c85f70] transition hover:bg-[#fff5f6]"
            >
              <PenLine className="h-4 w-4" aria-hidden="true" />
              Viết bài mới
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/dashboard"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 font-sans text-sm font-semibold text-[#c85f70] transition hover:bg-[#fff5f6]"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Quản trị blog
            </Link>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-sans text-sm text-[#be123c] transition hover:bg-[#fff1f2] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {isSigningOut ? "Đang đăng xuất..." : "Đăng xuất"}
          </button>
        </div>
      )}
    </div>
  );
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "U";
}
