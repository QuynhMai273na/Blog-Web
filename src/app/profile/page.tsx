"use client";

import Link from "next/link";
import type React from "react";
import { FormEvent, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import {
  updateDisplayName,
  updatePasswordWithCurrentPassword,
} from "@/services/auth.service";

type Profile = {
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  auth_provider: string | null;
  created_at: string | null;
};

type NoticeState = {
  tone: "success" | "error";
  message: string;
} | null;

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileNotice, setProfileNotice] = useState<NoticeState>(null);
  const [passwordNotice, setPasswordNotice] = useState<NoticeState>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);

      if (data.user) {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("display_name, avatar_url, email, auth_provider, created_at")
          .eq("id", data.user.id)
          .maybeSingle();

        if (error) {
          console.error("[profile.load]", error);
        } else {
          setProfile(profileData);
          setDisplayNameInput(
            profileData?.display_name ??
              data.user.user_metadata.full_name ??
              data.user.user_metadata.name ??
              "",
          );
        }
      }

      setIsLoading(false);
    });
  }, []);

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileNotice(null);

    if (!displayNameInput.trim()) {
      setProfileNotice({
        tone: "error",
        message: "Vui lòng nhập tên hiển thị.",
      });
      return;
    }

    setIsSavingProfile(true);
    const result = await updateDisplayName(displayNameInput);
    setIsSavingProfile(false);

    if (result.error) {
      setProfileNotice({ tone: "error", message: result.error });
      return;
    }

    const trimmedName = displayNameInput.trim();
    setDisplayNameInput(trimmedName);
    setProfile((current) =>
      current ? { ...current, display_name: trimmedName } : current,
    );
    setUser((current) =>
      current
        ? {
            ...current,
            user_metadata: {
              ...current.user_metadata,
              full_name: trimmedName,
              name: trimmedName,
            },
          }
        : current,
    );
    setProfileNotice({
      tone: "success",
      message: "Đã cập nhật thông tin cá nhân.",
    });
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordNotice(null);

    const validationError = validatePasswordForm({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    if (validationError) {
      setPasswordNotice({ tone: "error", message: validationError });
      return;
    }

    const email = profile?.email ?? user?.email;
    if (!email) {
      setPasswordNotice({
        tone: "error",
        message: "Không tìm thấy email để xác thực mật khẩu hiện tại.",
      });
      return;
    }

    setIsSavingPassword(true);
    const result = await updatePasswordWithCurrentPassword({
      email,
      currentPassword,
      newPassword,
    });
    setIsSavingPassword(false);

    if (result.error) {
      setPasswordNotice({ tone: "error", message: result.error });
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordNotice({
      tone: "success",
      message: "Đã đổi mật khẩu thành công.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#f7f2ed] px-4">
        <p className="font-sans text-sm text-[#7a5a55]">Đang tải hồ sơ...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#f7f2ed] px-4">
        <section className="w-full max-w-md rounded-[20px] border border-[#f0e6e0] bg-white p-8 text-center shadow-[0_4px_32px_rgba(74,44,42,0.07)]">
          <h1 className="font-serif text-2xl font-semibold text-[#3a2520]">
            Bạn chưa đăng nhập
          </h1>
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-lg bg-[#c9606e] px-4 py-2 font-sans text-sm font-semibold text-white transition hover:bg-[#e8768a]"
          >
            Đăng nhập
          </Link>
        </section>
      </div>
    );
  }

  const displayName =
    profile?.display_name ??
    user.user_metadata.full_name ??
    user.user_metadata.name ??
    "Người dùng";
  const email = profile?.email ?? user.email ?? "";
  const avatarUrl = profile?.avatar_url ?? user.user_metadata.avatar_url;
  const isGoogleAccount = profile?.auth_provider === "google";

  return (
    <div className="flex flex-1 justify-center overflow-y-auto bg-[#f7f2ed] px-4 py-8">
      <section className="w-full max-w-3xl rounded-[20px] border border-[#f0e6e0] bg-white p-8 shadow-[0_4px_32px_rgba(74,44,42,0.07)] max-[640px]:px-5">
        <div className="flex items-center gap-4 border-b border-[#f0e6e0] pb-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#efc7cc] bg-[#fff5f6] text-xl font-semibold text-[#c85f70]">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-serif text-2xl font-semibold text-[#3a2520]">
              {displayName}
            </h1>
            <p className="truncate font-sans text-sm text-[#9b7f79]">{email}</p>
          </div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <form
            onSubmit={handleProfileSubmit}
            className="rounded-xl border border-[#f0e6e0] p-5"
          >
            <div className="mb-5">
              <h2 className="font-serif text-xl font-semibold text-[#3a2520]">
                Thông tin cá nhân
              </h2>
              <p className="mt-1 font-sans text-xs leading-relaxed text-[#9b7f79]">
                Tên này sẽ hiển thị ở bình luận và menu tài khoản.
              </p>
            </div>

            <InputField
              id="displayName"
              label="Username"
              value={displayNameInput}
              onChange={setDisplayNameInput}
              placeholder="Tên hiển thị của bạn"
              autoComplete="name"
            />

            {profileNotice && (
              <Notice tone={profileNotice.tone}>{profileNotice.message}</Notice>
            )}

            <button
              type="submit"
              disabled={isSavingProfile}
              className="mt-2 w-full rounded-[10px] bg-[#c9606e] px-4 py-2.5 font-sans text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-[#e8768a] hover:shadow-[0_4px_14px_rgba(201,96,110,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSavingProfile ? "Đang lưu..." : "Lưu thông tin"}
            </button>
          </form>

          <form
            onSubmit={handlePasswordSubmit}
            className="rounded-xl border border-[#f0e6e0] p-5"
          >
            <div className="mb-5">
              <h2 className="font-serif text-xl font-semibold text-[#3a2520]">
                Đổi mật khẩu
              </h2>
              <p className="mt-1 font-sans text-xs leading-relaxed text-[#9b7f79]">
                Nhập mật khẩu hiện tại để xác nhận trước khi đổi mật khẩu mới.
              </p>
            </div>

            {isGoogleAccount ? (
              <Notice tone="error">
                Tài khoản này đang đăng nhập bằng Google nên không có mật khẩu
                thường để đổi tại đây.
              </Notice>
            ) : (
              <>
                <PasswordField
                  id="currentPassword"
                  label="Current password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  show={showCurrentPassword}
                  onToggle={() => setShowCurrentPassword((value) => !value)}
                  autoComplete="current-password"
                  placeholder="Mật khẩu hiện tại"
                />
                <PasswordField
                  id="newPassword"
                  label="New password"
                  value={newPassword}
                  onChange={setNewPassword}
                  show={showNewPassword}
                  onToggle={() => setShowNewPassword((value) => !value)}
                  autoComplete="new-password"
                  placeholder="Ít nhất 8 ký tự"
                />
                <PasswordField
                  id="confirmNewPassword"
                  label="Confirm new password"
                  value={confirmNewPassword}
                  onChange={setConfirmNewPassword}
                  show={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword((value) => !value)}
                  autoComplete="new-password"
                  placeholder="Nhập lại mật khẩu mới"
                />

                {passwordNotice && (
                  <Notice tone={passwordNotice.tone}>
                    {passwordNotice.message}
                  </Notice>
                )}

                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="mt-2 w-full rounded-[10px] bg-[#c9606e] px-4 py-2.5 font-sans text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-[#e8768a] hover:shadow-[0_4px_14px_rgba(201,96,110,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSavingPassword ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

function validatePasswordForm({
  currentPassword,
  newPassword,
  confirmNewPassword,
}: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) {
  if (!currentPassword) return "Vui lòng nhập mật khẩu hiện tại.";
  if (newPassword.length < 8) return "Mật khẩu mới cần ít nhất 8 ký tự.";
  if (newPassword === currentPassword) {
    return "Mật khẩu mới cần khác mật khẩu hiện tại.";
  }
  if (newPassword !== confirmNewPassword) {
    return "Mật khẩu xác nhận không khớp.";
  }

  return null;
}

function InputField({
  id,
  label,
  value,
  onChange,
  ...props
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <div className="mb-3">
      <label
        className="mb-[5px] block font-sans text-xs font-medium leading-tight text-[#7a5a55]"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        className="box-border block w-full min-w-0 rounded-lg border-[1.5px] border-[#2e1e1c] bg-[#2a1917] px-[13px] py-[9px] font-sans text-xs font-normal leading-tight text-[#fdf6f0] outline-none transition placeholder:text-[#6a4a48] focus:border-[#c9606e] focus:shadow-[0_0_0_3px_rgba(201,96,110,0.12)]"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  ...props
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <div className="mb-3">
      <label
        className="mb-[5px] block font-sans text-xs font-medium leading-tight text-[#7a5a55]"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className="box-border block w-full min-w-0 rounded-lg border-[1.5px] border-[#2e1e1c] bg-[#2a1917] px-[13px] py-[9px] pr-10 font-sans text-xs font-normal leading-tight text-[#fdf6f0] outline-none transition placeholder:text-[#6a4a48] focus:border-[#c9606e] focus:shadow-[0_0_0_3px_rgba(201,96,110,0.12)]"
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          {...props}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6a4a48] transition-colors hover:text-[#c9606e]"
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {show ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      </div>
    </div>
  );
}

function Notice({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "error" | "success";
}) {
  const className =
    tone === "error"
      ? "bg-[#fff1f2] text-[#be123c]"
      : "bg-[#eef8f0] text-[#347354]";

  return (
    <p
      className={`mb-3 rounded-lg px-3 py-2 text-left font-sans text-xs leading-relaxed ${className}`}
    >
      {children}
    </p>
  );
}

function EyeIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
