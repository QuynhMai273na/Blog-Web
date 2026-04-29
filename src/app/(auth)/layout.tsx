import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Becoming Blooming",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
