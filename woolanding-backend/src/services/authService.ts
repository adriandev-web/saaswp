import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as UserModel from '../models/User';
import { UserRegistration, UserLogin, JWTPayload } from '../types';
import { AppError } from '../middleware/errorHandler';

const SALT_ROUNDS = 10;

/**
 * Register a new user
 */
export async function register(userData: UserRegistration) {
  // Check if user already exists
  const existingUser = await UserModel.findByEmail(userData.email);
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(userData.password, SALT_ROUNDS);

  // Create user
  const user = await UserModel.create({
    ...userData,
    passwordHash,
  });

  // Generate tokens
  const tokens = generateTokens({
    sub: user.id,
    email: user.email,
  });

  return {
    user,
    ...tokens,
  };
}

/**
 * Login user
 */
export async function login(credentials: UserLogin) {
  // Find user with password
  const user = await UserModel.findByEmailWithPassword(credentials.email);

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check if user is active
  if (user.status !== 'active') {
    throw new AppError('Account is suspended or cancelled', 403);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Update last login
  await UserModel.updateLastLogin(user.id);

  // Generate tokens
  const tokens = generateTokens({
    sub: user.id,
    email: user.email,
  });

  // Return user data without password
  const { password_hash, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    ...tokens,
  };
}

/**
 * Generate access and refresh tokens
 */
export function generateTokens(payload: { sub: string; email: string; plan?: string }) {
  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT secrets not configured');
  }

  // @ts-expect-error - TS has issues with jwt.sign overloads
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );

  // @ts-expect-error - TS has issues with jwt.sign overloads
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return {
    accessToken,
    refreshToken,
  };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string) {
  if (!process.env.JWT_REFRESH_SECRET || !process.env.JWT_ACCESS_SECRET) {
    throw new Error('JWT secrets not configured');
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as JWTPayload;

    // Verify user still exists and is active
    const user = await UserModel.findById(decoded.sub);
    if (!user || user.status !== 'active') {
      throw new AppError('User not found or inactive', 401);
    }

    // Generate new access token
    // @ts-expect-error - TS has issues with jwt.sign overloads
    const accessToken = jwt.sign(
      { sub: decoded.sub, email: decoded.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
    );

    return { accessToken };
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Refresh token expired', 401);
    }
    throw new AppError('Invalid refresh token', 401);
  }
}

/**
 * Change user password
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  // Get user with password
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const userWithPassword = await UserModel.findByEmailWithPassword(user.email);
  if (!userWithPassword) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, userWithPassword.password_hash);
  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  // Update password
  await UserModel.updatePassword(userId, newPasswordHash);

  return { success: true };
}
