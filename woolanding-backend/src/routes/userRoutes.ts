import { Router } from 'express';
import * as UserController from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/user/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', UserController.getProfile);

/**
 * @route   PUT /api/v1/user/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  validateRequest(UserController.updateProfileValidation),
  UserController.updateProfile
);

/**
 * @route   GET /api/v1/user/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get('/stats', UserController.getStats);

/**
 * @route   DELETE /api/v1/user/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', UserController.deleteAccount);

export default router;
