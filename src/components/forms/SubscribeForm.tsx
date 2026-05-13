"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { subscribeEmail } from "@/services/subscriber.service";

type SubscribeStatus =
  | "idle"
  | "loading"
  | "success"
  | "duplicate"
  | "invalid"
  | "error";
type SubscribeVariant = "default" | "home" | "sidebar";

type SubscribeFormProps = {
  variant?: SubscribeVariant;
  className?: string;
  placeholder?: string;
  buttonLabel?: string;
};

const variantStyles: Record<
  SubscribeVariant,
  {
    form: string;
    row: string;
    input: string;
    button: string;
    message: string;
  }
> = {
  default: {
    form: "w-full",
    row: "flex flex-col gap-3 sm:flex-row",
    input:
      "flex-1 rounded-full border border-[#E8B8C8] bg-[#FFF8F5] px-4 py-2.5 text-sm text-[#5C3347] placeholder:text-[#C8A0B0] focus:outline-none focus:ring-2 focus:ring-[#D4748E]/30",
    button:
      "rounded-full bg-[#C25E7A] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#D4748E] disabled:cursor-not-allowed disabled:opacity-70",
    message: "mt-2 text-sm",
  },
  home: {
    form: "mx-auto max-w-md",
    row: "flex flex-col gap-3 sm:flex-row",
    input:
      "flex-1 rounded-xl border border-white/15 bg-[#3a4f3c] px-4 py-3 text-[14px] text-white outline-none transition-colors placeholder:text-white/35 focus:border-sage-300",
    button:
      "whitespace-nowrap rounded-xl bg-sage-300 px-7 py-3 text-[14px] font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-sage-500 hover:shadow-lg active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70",
    message: "mt-3 text-sm",
  },
  sidebar: {
    form: "mt-6",
    row: "space-y-4",
    input:
      "w-full rounded-[18px] border border-rose-100 bg-white px-4 py-3 text-[13px] font-medium text-[#9a6570] shadow-sm placeholder:text-[#9a6570] transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100",
    button:
      "w-full rounded-[18px] border border-rose-100 bg-rose-200 px-4 py-2 text-[13px] font-medium text-white shadow-sm transition hover:border-rose-300 hover:bg-rose-300 hover:text-text_secondary disabled:cursor-not-allowed disabled:opacity-70",
    message: "text-sm",
  },
};

export function SubscribeForm({
  variant = "default",
  className,
  placeholder = "email@example.com",
  buttonLabel = "Đăng ký",
}: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscribeStatus>("idle");
  const styles = variantStyles[variant];

  useEffect(() => {
    if (status === "idle" || status === "loading") return;

    const timeoutId = window.setTimeout(() => {
      setStatus("idle");
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) return;

    setStatus("loading");

    const result = await subscribeEmail(email);

    if (result.status === "success") {
      setEmail("");
      setStatus("success");
      return;
    }

    setStatus(result.status);
  }

  return (
    <form className={cn(styles.form, className)} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "idle" && status !== "loading") setStatus("idle");
          }}
          placeholder={placeholder}
          required
          autoComplete="email"
          className={styles.input}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={styles.button}
        >
          {status === "loading" ? "Đang gửi..." : buttonLabel}
        </button>
      </div>

      {status === "success" && (
        <p className={cn(styles.message, "text-[#4E7A56]")}>
          Đã đăng ký email thành công.
        </p>
      )}
      {status === "duplicate" && (
        <p className={cn(styles.message, "text-[#9a6570]")}>
          Email này đã có trong danh sách đăng ký.
        </p>
      )}
      {status === "invalid" && (
        <p className={cn(styles.message, "text-[#C25E7A]")}>
          Email không hợp lệ.
        </p>
      )}
      {status === "error" && (
        <p className={cn(styles.message, "text-[#C25E7A]")}>
          Chưa thể đăng ký email. Vui lòng thử lại sau.
        </p>
      )}
    </form>
  );
}
