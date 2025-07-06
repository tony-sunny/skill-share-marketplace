"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { queryAPI, Task, TaskResponse } from "@/lib/api";
import { useUser } from "@/lib/user-context";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/lib/require-auth";

export default function TasksPage() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => {
    queryAPI<TaskResponse>("tasks", { needAuth: true })
      .then((data) => {
        setTasks(data?.tasks || []);
      })
      .catch(() => {
        toast.error("Failed to get tasks");
      });

    return () => {
      toast.dismiss();
    };
  }, []);

  const handleOfferSubmit = async (taskId: number) => {
    try {
      await queryAPI("offers", {
        method: "POST",
        body: {
          task_id: Number(taskId),
        },
        needAuth: true,
        parseResponse: false,
      });
      toast.success("Offer created");
      setTimeout(() => router.push("/offers"), 1000);
    } catch {
      toast.error("Failed to create offer");
    }
  };

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Tasks</h2>
        {user?.role === "user" && (
          <div className="mb-8">
            <Link
              href="/tasks/new"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add New Task
            </Link>
          </div>
        )}
        <ul className="mb-6">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center border-b py-2"
            >
              <span>
                {task.name} ({task.category}) - {task.rate_currency}{" "}
                {task.hourly_rate}{" "}
                {task.expected_hours
                  ? `(Estimate: ${task.expected_hours} hours)`
                  : ""}
              </span>
              <span className="flex items-center gap-4">
                <Link
                  href={{ pathname: "/tasks/edit", query: { id: task.id } }}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                {user?.role === "provider" && (
                  <button
                    type="button"
                    className="inline-block bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                    onClick={() => handleOfferSubmit(task.id)}
                  >
                    Make Offer
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </RequireAuth>
  );
}
