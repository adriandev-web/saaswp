import * as UserModel from '../models/User';
import { AppError } from '../middleware/errorHandler';

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string) {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    companyName?: string;
    avatarUrl?: string;
    timezone?: string;
  }
) {
  // Verify user exists
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Update profile
  const updatedUser = await UserModel.updateProfile(userId, data);

  if (!updatedUser) {
    throw new AppError('Failed to update profile', 500);
  }

  return updatedUser;
}

/**
 * Get user statistics
 */
export async function getUserStats(userId: string) {
  // Verify user exists
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // TODO: Implement actual stats fetching from database
  // This would include generations count, subscription status, etc.
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    joinedAt: user.createdAt,
    status: user.status,
    // Placeholder data
    totalGenerations: 0,
    generationsThisMonth: 0,
    subscriptionStatus: 'active',
  };
}

/**
 * Delete user account
 */
export async function deleteUserAccount(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Soft delete
  const deleted = await UserModel.deleteUser(userId);

  if (!deleted) {
    throw new AppError('Failed to delete user', 500);
  }

  return { success: true };
}
