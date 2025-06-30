import pool from "../db.js";

export enum UserRole {
  User = "user",
  Provider = "provider",
}

export enum RoleType {
  Individual = "individual",
  Company = "company",
}

export interface User {
  id: number;
  role: UserRole;
  role_type: RoleType;
  first_name: string;
  last_name: string;
  company_name?: string;
  business_tax_number?: string;
  email: string;
  phone?: string;
  mobile: string;
  address?: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export async function createUser(user: Partial<User>): Promise<User> {
  const result = await pool.query(
    `INSERT INTO users (role, role_type, first_name, last_name, company_name, business_tax_number, email, phone, mobile, address, password_hash)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      user.role,
      user.role_type,
      user.first_name,
      user.last_name,
      user.company_name,
      user.business_tax_number,
      user.email,
      user.phone,
      user.mobile,
      user.address,
      user.password_hash,
    ],
  );
  return result.rows[0];
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0] || null;
}
