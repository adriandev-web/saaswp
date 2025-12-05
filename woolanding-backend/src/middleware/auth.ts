import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Authenticate user using JWT token from Authorization header
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'No token provided',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!process.env.JWT_ACCESS_SECRET) {
      console.error('JWT_ACCESS_SECRET not configured');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as JWTPayload;
      req.user = decoded;
      next();
    } catch (jwtError: any) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'TokenExpired',
          message: 'Token has expired',
        });
      }

      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid token',
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'InternalServerError',
      message: 'Authentication failed',
    });
  }
}

/**
 * Optional authentication - continues even if no token provided
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7);

  if (!process.env.JWT_ACCESS_SECRET) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as JWTPayload;
    req.user = decoded;
  } catch {
    // Token invalid but continue anyway
  }

  next();
}
