import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as GenerationService from '../services/generationService';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Validation rules for generation request
 */
export const generateValidation = [
  body('product').isObject().withMessage('Product data is required'),
  body('product.id').notEmpty().withMessage('Product ID is required'),
  body('product.name').notEmpty().withMessage('Product name is required'),
  body('product.price').isNumeric().withMessage('Product price must be a number'),
  body('options').optional().isObject(),
  body('options.template').optional().isString(),
  body('options.tone')
    .optional()
    .isIn(['professional', 'casual', 'enthusiastic'])
    .withMessage('Invalid tone'),
  body('options.language').optional().isString(),
];

/**
 * Generate landing page
 */
export const generate = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  const result = await GenerationService.generateLandingPage(req.user.sub, req.body);

  res.status(200).json({
    success: true,
    message: 'Landing page generated successfully',
    data: result,
  });
});

/**
 * Get generation history (placeholder)
 */
export const getHistory = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  // TODO: Implement actual history fetching from database
  res.status(200).json({
    success: true,
    data: {
      generations: [],
      total: 0,
    },
  });
});

/**
 * Get generation by ID (placeholder)
 */
export const getById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  // const { id } = req.params;

  // TODO: Implement actual generation fetching from database
  return res.status(404).json({
    success: false,
    error: 'Generation not found',
  });
});
