"use client";
import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      let fullPath = pathname;
      const query = searchParams.toString();
      if (query) fullPath += `?${query}`;
      router.replace(`/auth/login?callbackUrl=${encodeURIComponent(fullPath)}`);
    }
  }, [router, pathname, searchParams]);
  return <>{children}</>;
}
