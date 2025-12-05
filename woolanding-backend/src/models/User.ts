import { query } from '../utils/database';
import { User, UserRegistration } from '../types';

/**
 * User Model - Database operations for users table
 */

/**
 * Find user by ID
 */
export async function findById(id: string): Promise<User | null> {
  const result = await query<User>(
    'SELECT id, email, name, company_name, email_verified_at, created_at, updated_at, status FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

/**
 * Find user by email
 */
export async function findByEmail(email: string): Promise<User | null> {
  const result = await query<User>(
    'SELECT id, email, name, company_name, email_verified_at, created_at, updated_at, status FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

/**
 * Find user by email with password (for authentication)
 */
export async function findByEmailWithPassword(email: string) {
  const result = await query(
    'SELECT id, email, password_hash, name, email_verified_at, status FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

/**
 * Create new user
 */
export async function create(userData: UserRegistration & { passwordHash: string }) {
  const result = await query(
    `INSERT INTO users (email, password_hash, name, company_name)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, name, company_name, created_at, status`,
    [userData.email, userData.passwordHash, userData.name, userData.companyName || null]
  );
  return result.rows[0];
}

/**
 * Update user email verification status
 */
export async function verifyEmail(userId: string): Promise<boolean> {
  const result = await query(
    'UPDATE users SET email_verified_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
    [userId]
  );
  return result.rowCount !== null && result.rowCount > 0;
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string,
  data: { name?: string; companyName?: string; avatarUrl?: string; timezone?: string }
) {
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (data.name !== undefined) {
    updates.push(`name = $${paramCount++}`);
    values.push(data.name);
  }
  if (data.companyName !== undefined) {
    updates.push(`company_name = $${paramCount++}`);
    values.push(data.companyName);
  }
  if (data.avatarUrl !== undefined) {
    updates.push(`avatar_url = $${paramCount++}`);
    values.push(data.avatarUrl);
  }
  if (data.timezone !== undefined) {
    updates.push(`timezone = $${paramCount++}`);
    values.push(data.timezone);
  }

  if (updates.length === 0) {
    return null;
  }

  values.push(userId);
  const result = await query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, email, name, company_name, avatar_url, timezone`,
    values
  );
  return result.rows[0];
}

/**
 * Update user password
 */
export async function updatePassword(userId: string, newPasswordHash: string): Promise<boolean> {
  const result = await query(
    'UPDATE users SET password_hash = $1 WHERE id = $2',
    [newPasswordHash, userId]
  );
  return result.rowCount !== null && result.rowCount > 0;
}

/**
 * Update last login timestamp
 */
export async function updateLastLogin(userId: string): Promise<void> {
  await query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [userId]);
}

/**
 * Update Stripe customer ID
 */
export async function updateStripeCustomerId(userId: string, stripeCustomerId: string): Promise<boolean> {
  const result = await query(
    'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
    [stripeCustomerId, userId]
  );
  return result.rowCount !== null && result.rowCount > 0;
}

/**
 * Delete user (soft delete by changing status)
 */
export async function deleteUser(userId: string): Promise<boolean> {
  const result = await query(
    "UPDATE users SET status = 'cancelled' WHERE id = $1",
    [userId]
  );
  return result.rowCount !== null && result.rowCount > 0;
}

/**
 * Get user count
 */
export async function getUserCount(): Promise<number> {
  const result = await query('SELECT COUNT(*) as count FROM users');
  return parseInt(result.rows[0].count);
}

/**
 * Check if email exists
 */
export async function emailExists(email: string): Promise<boolean> {
  const result = await query('SELECT 1 FROM users WHERE email = $1', [email]);
  return result.rowCount !== null && result.rowCount > 0;
}
