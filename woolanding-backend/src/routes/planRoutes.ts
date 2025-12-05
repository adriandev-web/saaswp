import { Router } from 'express';
import * as PlanController from '../controllers/planController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/v1/plans
 * @desc    Get all active plans
 * @access  Public (optional auth)
 */
router.get('/', optionalAuth, PlanController.getPlans);

/**
 * @route   GET /api/v1/plans/:id
 * @desc    Get plan by ID
 * @access  Public (optional auth)
 */
router.get('/:id', optionalAuth, PlanController.getPlanById);

/**
 * @route   GET /api/v1/plans/slug/:slug
 * @desc    Get plan by slug
 * @access  Public (optional auth)
 */
router.get('/slug/:slug', optionalAuth, PlanController.getPlanBySlug);

export default router;
