import { query } from '../utils/database';
import { Plan } from '../types';

/**
 * Plan Model - Database operations for plans table
 */

/**
 * Get all active plans
 */
export async function findAll(): Promise<Plan[]> {
  const result = await query<Plan>(
    'SELECT * FROM plans WHERE is_active = true ORDER BY sort_order ASC'
  );
  return result.rows;
}

/**
 * Find plan by ID
 */
export async function findById(id: number): Promise<Plan | null> {
  const result = await query<Plan>('SELECT * FROM plans WHERE id = $1', [id]);
  return result.rows[0] || null;
}

/**
 * Find plan by slug
 */
export async function findBySlug(slug: string): Promise<Plan | null> {
  const result = await query<Plan>('SELECT * FROM plans WHERE slug = $1', [slug]);
  return result.rows[0] || null;
}

/**
 * Get free plan
 */
export async function getFreePlan(): Promise<Plan | null> {
  return findBySlug('free');
}
