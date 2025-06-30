"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { queryAPI, Skill } from "@/lib/api";
import Fallback from "@/components/ui/fallback";
import { RequireAuth } from "@/lib/require-auth";

export default function EditSkillPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skillId = searchParams.get("id");
  const [form, setForm] = useState<Partial<Skill> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!skillId) return;
    queryAPI<Skill>(`skills/${skillId}`)
      .then((data) => {
        setForm(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load skill");
        setLoading(false);
      });
  }, [skillId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await queryAPI(`skills/${skillId}`, {
        method: "PUT",
        body: { ...form, hourly_rate: Number(form?.hourly_rate) },
        needAuth: true,
        parseResponse: false,
      });
      toast.success("Skill updated");
      setTimeout(() => router.push("/skills"), 1000);
    } catch {
      toast.error("Failed to update skill");
    }
  };

  if (loading || !form) return <Fallback />;

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Edit Skill</h2>
        <form onSubmit={handleUpdate} className="space-y-2 mb-4">
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
            Experience
            <input
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </label>
          <label className="block">
            Nature of Work
            <select
              name="nature_of_work"
              value={form.nature_of_work}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="onsite">Onsite</option>
              <option value="online">Online</option>
            </select>
          </label>
          <label className="block">
            Hourly Rate
            <input
              name="hourly_rate"
              type="number"
              value={form.hourly_rate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
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
              onClick={() => router.push("/skills")}
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
