"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { RequireAuth } from "../../../lib/require-auth";
import { queryAPI } from "@/lib/api";
import Fallback from "@/components/ui/fallback";

export default function TaskProgressPage() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id");
  const [progress, setProgress] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) return;
    queryAPI(`tasks/${taskId}/progress`)
      .then((data) => {
        setProgress(data?.progress || "No progress yet.");
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

  if (loading) return <Fallback />;

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Task Progress</h2>
        <div className="bg-gray-100 p-4 rounded min-h-[80px] whitespace-pre-line">
          {progress}
        </div>
      </div>
    </RequireAuth>
  );
}
