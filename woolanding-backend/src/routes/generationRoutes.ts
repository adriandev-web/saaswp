import { Router } from 'express';
import * as GenerationController from '../controllers/generationController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { generationLimiter } from '../middleware/rateLimiter';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/generate
 * @desc    Generate landing page content
 * @access  Private
 */
router.post(
  '/',
  generationLimiter,
  validateRequest(GenerationController.generateValidation),
  GenerationController.generate
);

/**
 * @route   GET /api/v1/generate/history
 * @desc    Get generation history
 * @access  Private
 */
router.get('/history', GenerationController.getHistory);

/**
 * @route   GET /api/v1/generate/:id
 * @desc    Get generation by ID
 * @access  Private
 */
router.get('/:id', GenerationController.getById);

export default router;
