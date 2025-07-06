import pool from "../db";

export enum OfferStatus {
  Pending = "pending",
  Accepted = "accepted",
  Rejected = "rejected",
}

export interface Offer {
  id: number;
  task_id: number;
  provider_id: number;
  status: OfferStatus;
  created_at: Date;
}

export async function createOffer(offer: Partial<Offer>): Promise<Offer> {
  const result = await pool.query(
    `INSERT INTO offers (task_id, provider_id, status)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [offer.task_id, offer.provider_id, offer.status],
  );
  return result.rows[0];
}

export async function updateOfferStatus(
  id: number,
  status: OfferStatus,
): Promise<Offer> {
  const result = await pool.query(
    `UPDATE offers SET status = $2  WHERE id = $1 RETURNING *`,
    [id, status],
  );
  return result.rows[0];
}

export async function listOffersForUser(userId: number) {
  const result = await pool.query(
    `
    SELECT o.*, t.category as task_category, t.name as task_name, t.description as task_description, t.expected_start_date as task_expected_start_date, t.expected_hours as task_expected_hours, t.hourly_rate as task_hourly_rate, t.rate_currency as task_rate_currency, t.status as task_status,
           u.id as user_id, u.first_name as user_first_name, u.last_name as user_last_name, u.email as user_email, u.role as user_role, u.role_type as user_role_type
    FROM offers o
    JOIN tasks t ON o.task_id = t.id
    JOIN users u ON o.provider_id = u.id
    WHERE t.user_id = $1
    ORDER BY o.id DESC
  `,
    [userId],
  );
  return result.rows;
}

export async function listOffersFromProvider(providerId: number) {
  const result = await pool.query(
    `
    SELECT o.*, t.category as task_category, t.name as task_name, t.description as task_description, t.expected_start_date as task_expected_start_date, t.expected_hours as task_expected_hours, t.hourly_rate as task_hourly_rate, t.rate_currency as task_rate_currency, t.status as task_status
    FROM offers o
    JOIN tasks t ON o.task_id = t.id
    WHERE o.provider_id = $1
    ORDER BY o.id DESC
  `,
    [providerId],
  );
  return result.rows;
}

export async function isTaskAssignedToProvider(task_id: number, provider_id: number): Promise<boolean> {
  const result = await pool.query(
    `SELECT 1 FROM offers WHERE task_id = $1 AND provider_id = $2 AND status = ${OfferStatus.Accepted} LIMIT 1`,
    [task_id, provider_id]
  );
  return (result.rowCount ?? 0) > 0;
}
