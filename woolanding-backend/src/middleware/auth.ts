import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt';
import { findById } from '../models/User';
import { JWTPayload } from '../types';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        plan?: string;
      };
      token?: string;
    }
  }
}

/**
 * Authentication middleware - validates JWT token
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'No authentication token provided',
      });
      return;
    }

    // Verify token
    let decoded: JWTPayload;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: error instanceof Error ? error.message : 'Invalid token',
      });
      return;
    }

    // Check if user still exists
    const user = await findById(decoded.sub);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not found',
      });
      return;
    }

    // Check if user is active
    if (user.status !== 'active') {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'User account is not active',
      });
      return;
    }

    // Attach user info to request
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      plan: decoded.plan,
    };
    req.token = token;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
}

/**
 * Optional authentication - doesn't fail if no token provided
 * Useful for endpoints that work differently for authenticated users
 */
export async function optionalAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      // No token provided, continue without user
      next();
      return;
    }

    // Try to verify token
    try {
      const decoded = verifyAccessToken(token);
      const user = await findById(decoded.sub);

      if (user && user.status === 'active') {
        req.user = {
          id: decoded.sub,
          email: decoded.email,
          plan: decoded.plan,
        };
        req.token = token;
      }
    } catch (error) {
      // Invalid token, but we don't fail - just continue without user
      console.log('Optional auth failed, continuing without user');
    }

    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next();
  }
}

/**
 * Check if user has required plan
 */
export function requirePlan(allowedPlans: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    const userPlan = req.user.plan || 'free';

    if (!allowedPlans.includes(userPlan)) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `This feature requires one of these plans: ${allowedPlans.join(', ')}`,
      });
      return;
    }

    next();
  };
}

/**
 * Check if user email is verified
 */
export async function requireEmailVerified(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required',
    });
    return;
  }

  try {
    const user = await findById(req.user.id);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not found',
      });
      return;
    }

    if (!user.emailVerifiedAt) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Email verification required',
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Email verification check error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Verification check failed',
    });
  }
}
