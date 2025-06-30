"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { RequireAuth } from "../../../lib/require-auth";
import { queryAPI, TaskByIdResponse } from "@/lib/api";

export type FormState = {
  category?: string;
  name?: string;
  description?: string;
  expected_start_date?: string; // YYYY-MM-DD
  expected_hours?: number;
  hourly_rate?: number;
  rate_currency?: string;
}

export default function EditTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id");
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) return;
    queryAPI<TaskByIdResponse>(`tasks/${taskId}`)
      .then((data) => {
        setForm(data?.task ?? null);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load task");
        setLoading(false);
      });
  }, [taskId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await queryAPI(`tasks/${taskId}`, {
        method: "PUT",
        body: {
          ...form,
          expected_hours: Number(form?.expected_hours),
          hourly_rate: Number(form?.hourly_rate),
          expected_start_date: new Date(form!.expected_start_date!)
            .toISOString()
            .split("T")[0]!,
        },
        needAuth: true,
        parseResponse: false,
      });
      toast.success("Task updated");
      setTimeout(() => router.push("/tasks"), 1000);
    } catch {
      toast.error("Failed to update task");
    }
  };

  if (loading || !form)
    return <div className="p-8 text-center">Loading...</div>;

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <label className="block">
            Category
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
            </select>
          </label>
          <label className="block">
            Task Name <span className="text-red-500">*</span>
            <input
              name="name"
              placeholder="Task Name"
              value={form.name || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </label>
          <label className="block">
            Description
            <input
              name="description"
              placeholder="Description"
              value={form.description || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </label>
          <label className="block">
            Expected Start Date
            <input
              name="expected_start_date"
              type="date"
              placeholder="Expected Start Date"
              value={form.expected_start_date || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </label>
          <label className="block">
            Expected Hours
            <input
              name="expected_hours"
              type="number"
              placeholder="Expected Hours"
              value={form.expected_hours || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </label>
          <label className="block">
            Hourly Rate
            <input
              name="hourly_rate"
              type="number"
              placeholder="Hourly Rate"
              value={form.hourly_rate || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </label>
          <label className="block">
            Rate Currency
            <select
              name="rate_currency"
              value={form.rate_currency || "USD"}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="USD">USD</option>
              <option value="AUD">AUD</option>
              <option value="SGD">SGD</option>
              <option value="INR">INR</option>
            </select>
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => router.push("/tasks")}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </RequireAuth>
  );
}
