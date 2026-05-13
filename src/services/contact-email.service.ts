import type { ContactMessageInput } from "@/services/contact.service";

type SendContactEmailResult = {
  ok: boolean;
  error?: string;
};

const RESEND_EMAIL_ENDPOINT = "https://api.resend.com/emails";

export async function sendContactEmail(
  message: ContactMessageInput,
): Promise<SendContactEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.CONTACT_EMAIL_FROM;

  if (!apiKey || !to || !from) {
    return {
      ok: false,
      error:
        "Thiếu cấu hình RESEND_API_KEY, CONTACT_EMAIL_TO hoặc CONTACT_EMAIL_FROM.",
    };
  }

  const recipients = to
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    return {
      ok: false,
      error: "CONTACT_EMAIL_TO không có email nhận hợp lệ.",
    };
  }

  const response = await fetch(RESEND_EMAIL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      reply_to: message.email,
      subject: `[Becoming Blooming] ${message.topic} - ${message.name}`,
      text: buildTextEmail(message),
      html: buildHtmlEmail(message),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("[contact.email.send]", response.status, errorText);
    return {
      ok: false,
      error: `Resend ${response.status}: ${
        errorText || "Không thể gửi email liên hệ."
      }`,
    };
  }

  return { ok: true };
}

function buildTextEmail(message: ContactMessageInput) {
  return [
    "Bạn có tin nhắn mới từ trang liên hệ Becoming Blooming.",
    "",
    `Tên: ${message.name}`,
    `Email: ${message.email}`,
    `Chủ đề: ${message.topic}`,
    "",
    "Nội dung:",
    message.message,
  ].join("\n");
}

function buildHtmlEmail(message: ContactMessageInput) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#3a2520">
      <h2 style="margin:0 0 16px">Tin nhắn mới từ Becoming Blooming</h2>
      <p><strong>Tên:</strong> ${escapeHtml(message.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(message.email)}</p>
      <p><strong>Chủ đề:</strong> ${escapeHtml(message.topic)}</p>
      <div style="margin-top:20px;padding:16px;border:1px solid #f1ddd8;border-radius:12px;background:#fff8f6">
        ${escapeHtml(message.message).replace(/\n/g, "<br />")}
      </div>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
