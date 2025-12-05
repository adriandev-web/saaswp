import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as UserService from '../services/userService';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Validation rules for profile update
 */
export const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('companyName').optional().trim(),
  body('avatarUrl').optional().isURL().withMessage('Avatar URL must be a valid URL'),
  body('timezone').optional().trim(),
];

/**
 * Get user profile
 */
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  const profile = await UserService.getUserProfile(req.user.sub);

  res.status(200).json({
    success: true,
    data: profile,
  });
});

/**
 * Update user profile
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  const updatedProfile = await UserService.updateUserProfile(req.user.sub, req.body);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedProfile,
  });
});

/**
 * Get user statistics
 */
export const getStats = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  const stats = await UserService.getUserStats(req.user.sub);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

/**
 * Delete user account
 */
export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  const result = await UserService.deleteUserAccount(req.user.sub);

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully',
    data: result,
  });
});
