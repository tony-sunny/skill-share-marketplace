"use client";

import Link from "next/link";
import { useUser } from "./user-context";
import { useEffect, useState } from "react";

export function UserInfoNav() {
  const { user, logout } = useUser();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  if (!user)
    return (
      <span className="flex items-center gap-2">
        <Link href="/auth/login" className="ml-2 text-red-400 underline">
          Login
        </Link>
      </span>
    );
  return (
    <span className="flex items-center gap-2">
      <span className="font-semibold">{user.email}</span>
      <span className="text-xs bg-gray-700 px-2 py-1 rounded">{user.role}</span>
      <button onClick={logout} className="ml-2 text-red-400 underline">
        Logout
      </button>
    </span>
  );
}
