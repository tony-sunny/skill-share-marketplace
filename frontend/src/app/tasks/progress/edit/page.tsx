"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { RequireAuth } from "@/lib/require-auth";
import { queryAPI } from "@/lib/api";
import Fallback from "@/components/ui/fallback";

export default function EditTaskProgressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id");
  const [progress, setProgress] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) return;
    queryAPI(`tasks/${taskId}/progress`)
      .then((data) => {
        setProgress(data?.progress || "");
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load progress");
        setLoading(false);
      });

    return () => {
      toast.dismiss();
    };
  }, [taskId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await queryAPI(`tasks/${taskId}/progress`, {
        method: "PUT",
        body: { progress },
        needAuth: true,
        parseResponse: false,
      });
      toast.success("Progress updated");
      setTimeout(() => router.push(`/tasks/progress?id=${taskId}`), 1000);
    } catch {
      toast.error("Failed to update progress");
    }
  };

  if (loading) return <Fallback />;

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Edit Task Progress</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <textarea
            name="progress"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            className="w-full border p-2 rounded min-h-[120px]"
            placeholder="Update task progress..."
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => router.push(`/tasks/progress?id=${taskId}`)}
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
