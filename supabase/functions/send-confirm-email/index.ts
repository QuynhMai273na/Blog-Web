// // supabase/functions/send-confirm-email/index.ts
// import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

// serve(async (req) => {
//   const { record } = await req.json(); // payload từ Supabase Webhook

//   // Gửi email qua Resend (hoặc SendGrid, Mailgun...)
//   const res = await fetch("https://api.resend.com/emails", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${RESEND_API_KEY}`,
//     },
//     body: JSON.stringify({
//       from: "blog@yourdomain.com",
//       to: record.email,
//       subject: "Xác nhận đăng ký nhận bài viết mới",
//       html: `<p>Cảm ơn bạn đã đăng ký! <a href="https://yourblog.com">Xem blog</a></p>`,
//     }),
//   });

//   return new Response(JSON.stringify({ ok: true }), {
//     headers: { "Content-Type": "application/json" },
//   });
// });
