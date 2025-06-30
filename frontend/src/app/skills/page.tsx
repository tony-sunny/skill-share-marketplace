"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { queryAPI, Skill, SkillResponse } from "@/lib/api";
import { useUser } from "@/lib/user-context";
import Link from "next/link";
import { RequireAuth } from "@/lib/require-auth";

export default function SkillsPage() {
  const { user } = useUser();
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    queryAPI<SkillResponse>("skills", { needAuth: true })
      .then((data) => {
        setSkills(data?.skills || []);
      })
      .catch(() => {
        toast.error("Failed to get skills");
      });
  }, []);

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Skills</h2>
        {user?.role === "provider" && (
          <div className="mb-8">
            <Link
              href="/skills/new"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add New Skill
            </Link>
          </div>
        )}

        <ul className="mb-6">
          {skills.map((skill) => (
            <li
              key={skill.id}
              className="flex justify-between items-center border-b py-2"
            >
              <span>
                {skill.category} ({skill.nature_of_work}) - ${skill.hourly_rate}{" "}
                {skill.experience
                  ? `(Experience: ${skill.experience} years)`
                  : ""}
              </span>
              <span>
                <Link
                  href={{ pathname: "/skills/edit", query: { id: skill.id } }}
                  className="text-blue-600 hover:underline ml-2"
                >
                  Edit
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </RequireAuth >
  );
}
