"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { FormEvent, useState } from "react";
import { signInWithGoogle, signUpWithEmail } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("error");
  });

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    setMessage(null);

    const { error: googleError } = await signInWithGoogle();

    if (googleError) {
      console.error("[auth.google.start]", googleError);
      setError(googleError.message);
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const validationError = validateForm({
      displayName,
      email,
      password,
      confirmPassword,
      agreed,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    const result = await signUpWithEmail({ displayName, email, password });
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.needsEmailConfirmation) {
      setMessage(
        "Đã gửi email xác thực. Vui lòng mở email và xác thực trước khi đăng nhập.",
      );
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="relative flex w-full flex-1 items-center justify-center overflow-y-auto bg-[#f7f2ed] bg-[radial-gradient(ellipse_65%_55%_at_10%_15%,#fce8eb_0%,transparent_65%),radial-gradient(ellipse_55%_45%_at_90%_85%,#dcefd8_0%,transparent_65%),radial-gradient(ellipse_40%_40%_at_55%_50%,#f9f2ee_0%,transparent_70%)] px-4 py-3 max-[520px]:px-3.5">
      <section
        className="relative z-[1] w-full max-w-[370px] overflow-y-auto rounded-[20px] border border-[#f0e6e0] bg-white px-8 pb-7 pt-8 text-center text-[#3a2520] shadow-[0_4px_32px_rgba(74,44,42,0.07)] max-[520px]:rounded-[14px] max-[520px]:px-[18px]"
        aria-labelledby="register-title"
      >
        <h1
          id="register-title"
          className="mb-2 mt-0 font-serif text-2xl font-semibold leading-[1.2]"
        >
          <span className="text-[#d96e83]">Becoming </span>
          <span className="text-[#6b9b84] ">Blooming</span>
        </h1>

        <p className="mb-5 mt-0 font-sans text-xs leading-normal text-[#b09090]">
          Tạo tài khoản để lưu bài và bình luận
        </p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isSubmitting}
          className="inline-flex min-h-9 w-full items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] border-[#ead9d3] bg-white font-sans text-xs font-normal leading-none text-[#3a2520] transition duration-150 hover:-translate-y-px hover:border-[#f2a7b0] hover:bg-[#fdf6f0] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <GoogleIcon />
          <span>
            {isGoogleLoading ? "Đang chuyển hướng..." : "Tiếp tục với Google"}
          </span>
        </button>

        <div className="my-3 flex items-center gap-2.5">
          <span className="h-px flex-1 bg-[#ead9d3]" />
          <span className="font-sans text-xs text-[#b09090]">hoặc</span>
          <span className="h-px flex-1 bg-[#ead9d3]" />
        </div>

        <form className="text-left" onSubmit={handleSubmit}>
          <InputField
            id="displayName"
            label="Tên hiển thị"
            type="text"
            value={displayName}
            onChange={setDisplayName}
            placeholder="Tên của bạn"
            autoComplete="name"
          />
          <InputField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="email@example.com"
            autoComplete="email"
          />

          <PasswordField
            id="password"
            label="Mật khẩu"
            value={password}
            onChange={setPassword}
            show={showPassword}
            onToggle={() => setShowPassword((value) => !value)}
            autoComplete="new-password"
            placeholder="Ít nhất 8 ký tự"
          />
          <PasswordField
            id="confirmPassword"
            label="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirm}
            onToggle={() => setShowConfirm((value) => !value)}
            autoComplete="new-password"
            placeholder="Nhập lại mật khẩu"
          />

          <div className="mb-4 mt-3 flex items-start gap-2">
            <input
              id="agree"
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="mt-0.5 shrink-0 accent-[#c9606e]"
            />
            <label
              htmlFor="agree"
              className="font-sans text-xs leading-relaxed text-[#b09090]"
            >
              Mình đồng ý với{" "}
              <Link
                href="/terms"
                className="text-[#c9606e] no-underline hover:text-[#e8768a] hover:underline"
              >
                điều khoản sử dụng
              </Link>{" "}
              và{" "}
              <Link
                href="/privacy"
                className="text-[#c9606e] no-underline hover:text-[#e8768a] hover:underline"
              >
                chính sách quyền riêng tư
              </Link>
            </label>
          </div>

          {message && <Notice tone="success">{message}</Notice>}
          {error && <Notice tone="error">{error}</Notice>}

          <button
            type="submit"
            disabled={isSubmitting || isGoogleLoading}
            className="mb-3.5 mt-1 w-full cursor-pointer rounded-[10px] border-0 bg-[#c9606e] px-4 py-2.5 font-sans text-sm font-medium leading-tight text-white transition duration-150 hover:-translate-y-px hover:bg-[#e8768a] hover:shadow-[0_4px_14px_rgba(201,96,110,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </button>
        </form>

        <p className="m-0 font-sans text-xs leading-snug text-[#b09090]">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="font-medium text-[#c9606e] no-underline hover:text-[#e8768a] hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </section>
    </div>
  );
}

function validateForm({
  displayName,
  email,
  password,
  confirmPassword,
  agreed,
}: {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
}) {
  if (!displayName.trim()) return "Vui lòng nhập tên hiển thị.";
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Email không hợp lệ.";
  if (password.length < 8) return "Mật khẩu cần ít nhất 8 ký tự.";
  if (password !== confirmPassword) return "Mật khẩu xác nhận không khớp.";
  if (!agreed) return "Vui lòng đồng ý với điều khoản trước khi đăng ký.";
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

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}
