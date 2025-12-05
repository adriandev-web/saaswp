import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as AuthService from '../services/authService';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Validation rules for registration
 */
export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('companyName').optional().trim(),
];

/**
 * Validation rules for login
 */
export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * Register new user
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

/**
 * Login user
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

/**
 * Refresh access token
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      error: 'Refresh token is required',
    });
  }

  const result = await AuthService.refreshAccessToken(refreshToken);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * Get current user info
 */
export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      userId: req.user.sub,
      email: req.user.email,
      plan: req.user.plan,
    },
  });
});

/**
 * Change password
 */
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Current password and new password are required',
    });
  }

  const result = await AuthService.changePassword(req.user.sub, currentPassword, newPassword);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});
