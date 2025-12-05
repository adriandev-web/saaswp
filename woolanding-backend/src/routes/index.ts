import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import generationRoutes from './generationRoutes';
import planRoutes from './planRoutes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/generate', generationRoutes);
router.use('/plans', planRoutes);

export default router;
