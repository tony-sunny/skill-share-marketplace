import pool from "../db";
import type { Category } from "./skill";

export enum Currency {
  USD = "USD",
  INR = "INR",
  AUD = "AUD",
  SGD = "SGD",
}

export enum TaskStatus {
  Open = "open",
  Completed = "completed",
  Accepted = "Accepted",
}

export interface Task {
  id: number;
  user_id: number;
  category: Category;
  name: string;
  description?: string;
  expected_start_date: string;
  expected_hours?: number;
  hourly_rate: number;
  rate_currency: Currency;
  status: string;
  created_at: Date;
  updated_at: Date;
}
export interface TaskProgress {
  id: number;
  task_id: number;
  provider_id: number;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export async function createTask(task: Partial<Task>): Promise<Task> {
  const result = await pool.query(
    `INSERT INTO tasks (user_id, category, name, description, expected_start_date, expected_hours, hourly_rate, rate_currency, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [
      task.user_id,
      task.category,
      task.name,
      task.description,
      task.expected_start_date,
      task.expected_hours,
      task.hourly_rate,
      task.rate_currency,
      task.status,
    ],
  );
  return result.rows[0];
}

// List all tasks with pagination
export async function listTasks({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}) {
  const result = await pool.query(
    `SELECT * FROM tasks ORDER BY id DESC OFFSET $1 LIMIT $2`,
    [offset, limit],
  );
  return result.rows;
}

// Count all tasks
export async function countTasks() {
  const result = await pool.query(`SELECT COUNT(*) FROM tasks`);
  return parseInt(result.rows[0].count, 10);
}

// Get a single task by id
export async function getTaskById(id: number) {
  const result = await pool.query(`SELECT * FROM tasks WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

export async function updateTask(
  id: number,
  updates: Partial<Task>,
): Promise<Task> {
  const fields = Object.keys(updates)
    .map((k, i) => `${k} = $${i + 2}`)
    .join(", ");
  const values = [id, ...Object.values(updates)];
  const result = await pool.query(
    `UPDATE tasks SET ${fields} WHERE id = $1 RETURNING *`,
    values,
  );
  return result.rows[0];
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
