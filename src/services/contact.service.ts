import { isContactTopic } from "@/constants/contact";

export type ContactMessageInput = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export type ContactFieldErrors = Partial<
  Record<keyof ContactMessageInput, string>
>;

export type ContactValidationResult =
  | {
      ok: true;
      data: ContactMessageInput;
    }
  | {
      ok: false;
      fieldErrors: ContactFieldErrors;
    };

export type ContactSubmitResult = {
  ok: boolean;
  message: string;
  fieldErrors?: ContactFieldErrors;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactMessage(
  input: unknown,
): ContactValidationResult {
  const data = normalizeContactInput(input);
  const fieldErrors: ContactFieldErrors = {};

  if (data.name.length < 2) {
    fieldErrors.name = "Vui lòng nhập tên ít nhất 2 ký tự.";
  } else if (data.name.length > 80) {
    fieldErrors.name = "Tên không nên dài quá 80 ký tự.";
  }

  if (!EMAIL_PATTERN.test(data.email)) {
    fieldErrors.email = "Email không hợp lệ.";
  }

  if (!data.topic || !isContactTopic(data.topic)) {
    fieldErrors.topic = "Vui lòng chọn chủ đề phù hợp.";
  }

  if (data.message.length < 10) {
    fieldErrors.message = "Nội dung cần ít nhất 10 ký tự.";
  } else if (data.message.length > 2000) {
    fieldErrors.message = "Nội dung không nên dài quá 2000 ký tự.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return { ok: true, data };
}

export async function sendContactMessage(
  input: ContactMessageInput,
): Promise<ContactSubmitResult> {
  const validation = validateContactMessage(input);

  if (!validation.ok) {
    return {
      ok: false,
      message: "Vui lòng kiểm tra lại thông tin đã nhập.",
      fieldErrors: validation.fieldErrors,
    };
  }

  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validation.data),
  });

  const result = (await response.json().catch(() => null)) as
    | ContactSubmitResult
    | null;

  if (!response.ok) {
    return {
      ok: false,
      message: result?.message ?? "Chưa thể gửi tin nhắn. Vui lòng thử lại.",
      fieldErrors: result?.fieldErrors,
    };
  }

  return {
    ok: true,
    message: result?.message ?? "Đã gửi tin nhắn thành công.",
  };
}

function normalizeContactInput(input: unknown): ContactMessageInput {
  const record =
    input && typeof input === "object"
      ? (input as Partial<Record<keyof ContactMessageInput, unknown>>)
      : {};

  return {
    name: getString(record.name).trim().replace(/\s+/g, " "),
    email: getString(record.email).trim().toLowerCase(),
    topic: getString(record.topic).trim(),
    message: getString(record.message).trim(),
  };
}

function getString(value: unknown) {
  return typeof value === "string" ? value : "";
}
