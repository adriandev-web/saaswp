import { Request, Response } from 'express';
import * as PlanModel from '../models/Plan';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Get all active plans
 */
export const getPlans = asyncHandler(async (_req: Request, res: Response) => {
  const plans = await PlanModel.findAll();

  res.status(200).json({
    success: true,
    data: plans,
  });
});

/**
 * Get plan by ID
 */
export const getPlanById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const plan = await PlanModel.findById(parseInt(id));

  if (!plan) {
    return res.status(404).json({
      success: false,
      error: 'Plan not found',
    });
  }

  res.status(200).json({
    success: true,
    data: plan,
  });
});

/**
 * Get plan by slug
 */
export const getPlanBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const plan = await PlanModel.findBySlug(slug);

  if (!plan) {
    return res.status(404).json({
      success: false,
      error: 'Plan not found',
    });
  }

  res.status(200).json({
    success: true,
    data: plan,
  });
});
