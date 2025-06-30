"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { queryAPI, LoginResponse } from "@/lib/api";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await queryAPI<LoginResponse>("auth/login", {
        method: "POST",
        body: form,
        needAuth: false,
      });
      const token = res?.token;
      if (!token) {
        toast.error("Login failed");
        return;
      }
      localStorage.setItem("auth_token", token);
      window.location.href = callbackUrl;
    } catch {
      toast.error("Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
        <div className="text-center mt-4">
          <span>Do not have an account? </span>
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
