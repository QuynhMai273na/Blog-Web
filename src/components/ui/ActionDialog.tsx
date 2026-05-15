"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export type DialogTone = "neutral" | "danger" | "success" | "error";
export type MessageTone = "success" | "error" | "info";
export type ActionVariant = "primary" | "secondary" | "danger" | "success";

export type DialogAction = {
  label: string;
  type?: "button" | "submit";
  variant?: ActionVariant;
  disabled?: boolean;
  onClick?: () => void;
};

export type DialogMessage = {
  tone: MessageTone;
  children: ReactNode;
};

export type ActionDialogProps = {
  open: boolean;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  message?: DialogMessage;
  actions?: DialogAction[];
  tone?: DialogTone;
  labelledById?: string;
  closeOnBackdrop?: boolean;
  className?: string;
  onClose?: () => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
};

const titleToneStyles: Record<DialogTone, string> = {
  neutral: "text-[#3a2520]",
  danger: "text-[#9f1239]",
  success: "text-[#4E7A56]",
  error: "text-[#be123c]",
};

const messageToneStyles: Record<MessageTone, string> = {
  success: "border-sage-100 bg-sage-50 text-[#4E7A56]",
  error: "border-rose-100 bg-rose-50 text-[#be123c]",
  info: "border-[#e5e5e5] bg-[#fafafa] text-[#7a5a55]",
};

const actionVariantStyles: Record<ActionVariant, string> = {
  primary:
    "border-sage-100 bg-sage-500 text-white hover:bg-sage-800 disabled:hover:bg-sage-500",
  secondary:
    "border-[#e5e5e5] bg-white text-[#7a5a55] hover:bg-gray-50 disabled:hover:bg-white",
  danger:
    "border-rose-100 bg-[#be123c] text-white hover:bg-[#9f1239] disabled:hover:bg-[#be123c]",
  success:
    "border-sage-100 bg-sage-50 text-[#4E7A56] hover:bg-sage-100 disabled:hover:bg-sage-50",
};

export function ActionDialog({
  open,
  title,
  description,
  children,
  message,
  actions = [],
  tone = "neutral",
  labelledById,
  closeOnBackdrop = true,
  className,
  onClose,
  onSubmit,
}: ActionDialogProps) {
  useEffect(() => {
    if (!open) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const titleId = labelledById ?? "action-dialog-title";
  const content = (
    <>
      <h3
        id={titleId}
        className={cn("font-sans text-sm font-semibold", titleToneStyles[tone])}
      >
        {title}
      </h3>

      {description ? (
        <div className="mt-2 text-xs leading-5 text-[#7a5a55]">
          {description}
        </div>
      ) : null}

      {children}

      {message ? (
        <div
          className={cn(
            "mt-4 rounded-xl border px-3 py-2 text-xs leading-5",
            messageToneStyles[message.tone],
          )}
          aria-live="polite"
        >
          {message.children}
        </div>
      ) : null}

      {actions.length > 0 ? (
        <div className="mt-4 flex justify-end gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              type={action.type ?? "button"}
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                actionVariantStyles[action.variant ?? "secondary"],
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
  const panelClassName = cn(
    "w-full max-w-sm rounded-2xl border border-rose-100 bg-white p-5 text-left shadow-[0_24px_70px_rgba(45,62,47,0.18)]",
    className,
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden overscroll-contain bg-[#2d1f1f]/65 px-4 backdrop-blur-sm animate-[fadeIn_180ms_var(--ease-out-soft)_both]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onWheel={(event) => event.preventDefault()}
      onTouchMove={(event) => event.preventDefault()}
      onMouseDown={(event) => {
        if (
          closeOnBackdrop &&
          onClose &&
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      {onSubmit ? (
        <form
          className={cn(
            panelClassName,
            "animate-[pageReveal_220ms_var(--ease-out-soft)_both]",
          )}
          onSubmit={onSubmit}
        >
          {content}
        </form>
      ) : (
        <div
          className={cn(
            panelClassName,
            "animate-[pageReveal_220ms_var(--ease-out-soft)_both]",
          )}
        >
          {content}
        </div>
      )}
    </div>,
    document.body,
  );
}
