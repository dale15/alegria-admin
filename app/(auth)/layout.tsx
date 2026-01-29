"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      {" "}
      {children}{" "}
    </div>
  );
}
