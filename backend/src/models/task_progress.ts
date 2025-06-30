import pool from "../db";

export interface TaskProgress {
  id: number;
  task_id: number;
  provider_id: number;
  description: string;
  created_at: Date;
}

export async function updateTaskProgress(
  progress: Partial<TaskProgress>,
): Promise<TaskProgress> {
  const result = await pool.query(
    `INSERT INTO task_progress (task_id, provider_id, description)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [progress.task_id, progress.provider_id, progress.description],
  );
  return result.rows[0];
}
