"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AutoRefresh({
  intervalMs = 30000,
}: {
  intervalMs?: number;
}) {
  const router = useRouter();

  useEffect(() => {
    if (intervalMs <= 0) return;

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [intervalMs, router]);

  return null;
}
