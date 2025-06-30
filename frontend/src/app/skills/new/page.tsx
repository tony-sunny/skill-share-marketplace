"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RequireAuth } from "../../../lib/require-auth";
import { queryAPI } from "@/lib/api";

export default function NewSkillPage() {
  const [newSkill, setNewSkill] = useState({
    category: "programming",
    experience: "",
    nature_of_work: "onsite",
    hourly_rate: "",
  });
  const router = useRouter();

  const handleNewSkillChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setNewSkill({ ...newSkill, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await queryAPI("skills", {
        method: "POST",
        body: { ...newSkill, hourly_rate: Number(newSkill.hourly_rate) },
        needAuth: true,
        parseResponse: false,
      });
      toast.success("Skill created");
      setTimeout(() => router.push("/skills"), 1000);
    } catch {
      toast.error("Failed to create skill");
    }
  };

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Add New Skill</h2>
        <form onSubmit={handleCreate} className="space-y-2 mb-8">
          <label className="block">
            Category
            <select
              name="category"
              value={newSkill.category}
              onChange={handleNewSkillChange}
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
              value={newSkill.experience}
              onChange={handleNewSkillChange}
              className="w-full border p-2 rounded"
              placeholder="Experience"
            />
          </label>
          <label className="block">
            Nature of Work
            <select
              name="nature_of_work"
              value={newSkill.nature_of_work}
              onChange={handleNewSkillChange}
              className="w-full border p-2 rounded"
            >
              <option value="onsite">Onsite</option>
              <option value="online">Online</option>
            </select>
          </label>
          <label className="block">
            Hourly Rate <span className="text-red-500">*</span>
            <input
              name="hourly_rate"
              type="number"
              value={newSkill.hourly_rate}
              onChange={handleNewSkillChange}
              className="w-full border p-2 rounded"
              placeholder="Hourly Rate"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            Add Skill
          </button>
        </form>
      </div>
    </RequireAuth>
  );
}
