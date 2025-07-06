import pool from "../db";

export enum Category {
  Programming = "programming",
  Design = "design",
  Marketing = "marketing",
}

export enum WorkNature {
  Onsite = "onsite",
  Online = "online",
}

export interface Skill {
  id: number;
  user_id: number;
  category: Category;
  experience?: string;
  nature_of_work: WorkNature;
  hourly_rate: number;
  created_at: Date;
  updated_at: Date;
}

export async function createSkill(skill: Partial<Skill>): Promise<Skill> {
  const result = await pool.query(
    `INSERT INTO skills (user_id, category, experience, nature_of_work, hourly_rate)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      skill.user_id,
      skill.category,
      skill.experience,
      skill.nature_of_work,
      skill.hourly_rate,
    ],
  );
  return result.rows[0];
}

export async function updateSkill(
  id: number,
  updates: Partial<Skill>,
): Promise<Skill> {
  const fields = Object.keys(updates)
    .map((k, i) => `${k} = $${i + 2}`)
    .join(", ");
  const values = [id, ...Object.values(updates)];
  const result = await pool.query(
    `UPDATE skills SET ${fields} WHERE id = $1 RETURNING *`,
    values,
  );
  return result.rows[0];
}

export async function listSkills({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}) {
  const result = await pool.query(
    `SELECT * FROM skills ORDER BY id DESC OFFSET $1 LIMIT $2`,
    [offset, limit],
  );
  return result.rows;
}

export async function countSkills() {
  const result = await pool.query(`SELECT COUNT(*) FROM skills`);
  return parseInt(result.rows[0].count, 10);
}

export async function getSkillById(id: number) {
  const result = await pool.query(`SELECT * FROM skills WHERE id = $1`, [id]);
  return result.rows[0] || null;
}
