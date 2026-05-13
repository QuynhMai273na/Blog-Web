"use client";

import type { FormEvent } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

import { CONTACT_TOPIC_OPTIONS } from "@/constants/contact";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  type ContactFieldErrors,
  sendContactMessage,
  validateContactMessage,
} from "@/services/contact.service";

type SubmitStatus = "idle" | "loading" | "success" | "error";

const initialForm = {
  name: "",
  email: "",
  topic: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const isFormValid = validateContactMessage(form).ok;

  useEffect(() => {
    if (status !== "success" && status !== "error") return;

    const timeoutId = window.setTimeout(() => {
      setStatus("idle");
      setStatusMessage("");
      setFieldErrors({});
      setForm(initialForm);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setStatusMessage("");
    setFieldErrors({});

    const result = await sendContactMessage(form);

    if (!result.ok) {
      setStatus("error");
      setStatusMessage(result.message);
      setFieldErrors(result.fieldErrors ?? {});
      return;
    }

    setStatus("success");
    setStatusMessage(result.message);
  }

  return (
    <form className="mt-4 space-y-5" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-2 block text-base font-semibold tracking-[0.01em] text-text_secondary">
          Tên của bạn
        </span>
        <input
          type="text"
          value={form.name}
          onChange={(event) =>
            updateField("name", event.target.value, setForm, setFieldErrors)
          }
          placeholder="Nguyễn Văn A"
          autoComplete="name"
          required
          className="input-field rounded-[22px] border-rose-200 bg-white px-5 py-4 text-[15px] text-text_primary shadow-[0_8px_24px_rgba(214,156,161,0.08)] placeholder:text-[15px] placeholder:text-text_secondary focus:border-rose-300 focus:ring-rose-200"
        />
        <FieldError message={fieldErrors.name} />
      </label>

      <label className="block">
        <span className="mb-2 block text-base font-semibold tracking-[0.01em] text-text_secondary">
          Email
        </span>
        <input
          type="email"
          value={form.email}
          onChange={(event) =>
            updateField("email", event.target.value, setForm, setFieldErrors)
          }
          placeholder="email@example.com"
          autoComplete="email"
          required
          className="input-field rounded-[22px] border-rose-200 bg-white px-5 py-4 text-[15px] text-text_primary shadow-[0_8px_24px_rgba(214,156,161,0.08)] placeholder:text-[15px] placeholder:text-text_secondary focus:border-rose-300 focus:ring-rose-200"
        />
        <FieldError message={fieldErrors.email} />
      </label>

      <label className="block">
        <span className="mb-2 block text-base font-semibold tracking-[0.01em] text-text_secondary">
          Chủ đề
        </span>
        <CustomSelect
          options={CONTACT_TOPIC_OPTIONS}
          value={form.topic}
          placeholder="Chọn chủ đề bạn muốn gửi..."
          onChange={(value) =>
            updateField("topic", value, setForm, setFieldErrors)
          }
        />
        <FieldError message={fieldErrors.topic} />
      </label>

      <label className="block">
        <span className="mb-2 block text-base font-semibold tracking-[0.01em] text-text_secondary">
          Nội dung
        </span>
        <textarea
          rows={6}
          value={form.message}
          onChange={(event) =>
            updateField("message", event.target.value, setForm, setFieldErrors)
          }
          placeholder="Chia sẻ điều bạn muốn nói với mình..."
          required
          className="input-field min-h-40 resize-none overflow-hidden rounded-[24px] border-rose-200 bg-white px-5 py-4 text-[15px] text-text_primary shadow-[0_8px_24px_rgba(214,156,161,0.08)] placeholder:font-serif placeholder:text-[15px] placeholder:text-text_secondary focus:border-rose-300 focus:ring-rose-200"
        />
        <FieldError message={fieldErrors.message} />
      </label>

      {statusMessage ? (
        <p
          className={`rounded-2xl border px-4 py-3 text-sm ${
            status === "success"
              ? "border-sage-100 bg-sage-50 text-[#4E7A56]"
              : "border-rose-100 bg-rose-50 text-[#C25E7A]"
          }`}
        >
          {statusMessage}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 border-t border-rose-100/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-sm leading-6 text-sage-800/60">
          Mình ưu tiên phản hồi các tin nhắn rõ ràng, chân thành và có đủ thông
          tin liên hệ.
        </p>
        <button
          type="submit"
          disabled={status === "loading" || !isFormValid}
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#a8bfa0] px-7 py-3 text-[13px] font-semibold tracking-[0.08em] text-white shadow-[0_4px_14px_rgba(168,191,160,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96b08d] hover:shadow-[0_6px_20px_rgba(168,191,160,0.55)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Đang gửi..." : "Gửi tin nhắn"}
        </button>
      </div>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-sm text-[#C25E7A]">{message}</p>;
}

function updateField(
  key: keyof typeof initialForm,
  value: string,
  setForm: Dispatch<SetStateAction<typeof initialForm>>,
  setFieldErrors: Dispatch<SetStateAction<ContactFieldErrors>>,
) {
  setForm((current) => ({ ...current, [key]: value }));
  setFieldErrors((current) => ({ ...current, [key]: undefined }));
}
