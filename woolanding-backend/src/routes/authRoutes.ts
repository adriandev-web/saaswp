import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * POST /auth/register
 * Register a new user
 */
router.post(
  '/register',
  authController.registerValidation,
  authController.register
);

/**
 * POST /auth/login
 * Login user
 */
router.post(
  '/login',
  authController.loginValidation,
  authController.login
);

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', authController.refreshToken);

/**
 * GET /auth/me
 * Get current user profile (requires authentication)
 */
router.get('/me', authenticate, authController.me);

/**
 * POST /auth/logout
 * Logout user (client-side token deletion, but logs the action)
 */
router.post('/logout', authenticate, authController.logout);

/**
 * PUT /auth/change-password
 * Change user password (requires authentication)
 */
router.put('/change-password', authenticate, authController.changePassword);

export default router;
