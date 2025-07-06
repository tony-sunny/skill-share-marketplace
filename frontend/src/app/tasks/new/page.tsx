"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RequireAuth } from "../../../lib/require-auth";
import { queryAPI } from "@/lib/api";

export default function NewTaskPage() {
  const [form, setForm] = useState({
    category: "programming",
    name: "",
    description: "",
    expected_start_date: "",
    expected_hours: "",
    hourly_rate: "",
    rate_currency: "AUD",
  });
  const router = useRouter();

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await queryAPI("tasks", {
        method: "POST",
        body: {
          ...form,
          expected_hours: Number(form.expected_hours),
          hourly_rate: Number(form.hourly_rate),
          expected_start_date: new Date(form.expected_start_date)
            .toISOString()
            .split("T")[0]!,
        },
        needAuth: true,
        parseResponse: false,
      });
      toast.success("Task created");
      setTimeout(() => router.push("/tasks"), 1000);
    } catch {
      toast.error("Failed to create task");
    }
  };

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
        <div className="text-sm text-gray-500 mb-2">
          Fields marked with <span className="text-red-500">*</span> are
          required.
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            Add Task
          </button>
        </form>
      </div>
    </RequireAuth>
  );
}
