import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { sendContactEmail } from "@/services/contact-email.service";
import { validateContactMessage } from "@/services/contact.service";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const validation = validateContactMessage(payload);

  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: "Vui lòng kiểm tra lại thông tin đã nhập.",
        fieldErrors: validation.fieldErrors,
      },
      { status: 400 },
    );
  }

  const emailResult = await sendContactEmail(validation.data);

  if (!emailResult.ok) {
    console.error("[contact.email]", emailResult.error);
    const isDevelopment = process.env.NODE_ENV !== "production";
    return NextResponse.json(
      {
        ok: false,
        message: isDevelopment
          ? (emailResult.error ?? "Chưa thể gửi tin nhắn.")
          : "Chưa thể gửi tin nhắn. Vui lòng thử lại sau.",
      },
      { status: 500 },
    );
  }

  await saveContactMessage(validation.data);

  return NextResponse.json({
    ok: true,
    message: "Đã gửi tin nhắn thành công. Cảm ơn bạn đã liên hệ.",
  });
}

async function saveContactMessage(message: {
  name: string;
  email: string;
  topic: string;
  message: string;
}) {
  const supabase = createClient();
  const { error } = await supabase.from("contacts").insert({
    name: message.name,
    email: message.email,
    message: `[${message.topic}]\n\n${message.message}`,
  });

  if (error) {
    console.error("[contact.save]", error);
  }
}
