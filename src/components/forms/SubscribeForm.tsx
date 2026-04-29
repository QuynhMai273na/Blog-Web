"use client";
// components/SubscribeForm.tsx
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const supabase = createClient();

  async function handleSubscribe() {
    if (!email) return;
    setStatus("loading");

    const { error } = await supabase.from("subscribers").insert({ email });

    setStatus(error ? "error" : "success");
    if (!error) setEmail("");
  }

  return (
    <div className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@example.com"
        className="flex-1 border border-[#E8B8C8] rounded-full px-4 py-2.5 text-sm bg-[#FFF8F5] text-[#5C3347] placeholder:text-[#C8A0B0] focus:outline-none focus:ring-2 focus:ring-[#D4748E]/30"
        onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
      />
      <button
        onClick={handleSubscribe}
        disabled={status === "loading"}
        className="px-6 py-2.5 bg-[#C25E7A] hover:bg-[#D4748E] text-white rounded-full text-sm font-medium transition-colors"
      >
        {status === "loading" ? "..." : "Đăng ký"}
      </button>
      {status === "success" && (
        <p className="text-[#4E7A56] text-sm mt-2">Đã đăng ký!</p>
      )}
      {status === "error" && (
        <p className="text-[#C25E7A] text-sm mt-2">Email đã tồn tại hoặc lỗi</p>
      )}
    </div>
  );
}
