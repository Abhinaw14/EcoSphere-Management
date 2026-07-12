// ============================================================
// EcoSphere — Auth Service
// Business logic for authentication and user management
// ============================================================

import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../../config/env';
import { authRepository } from '../repositories/auth.repository';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../../../utils/errors';
import type { JwtPayload } from '../../../middlewares/auth';
import type {
  LoginInput,
  RegisterInput,
  ChangePasswordInput,
  UpdateProfileInput,
} from '../validators/auth.validator';

class AuthService {
  private readonly SALT_ROUNDS = 12;

  /**
   * Authenticate user and return tokens
   */
  async login(input: LoginInput) {
    const user = await authRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    const isValidPassword = await bcryptjs.compare(input.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = this.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        role: user.role,
        xpPoints: user.xpPoints,
        departmentId: user.departmentId,
      },
    };
  }

  /**
   * Register a new user (admin-only operation)
   */
  async register(input: RegisterInput) {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('User with this email already exists');
    }

    const hashedPassword = await bcryptjs.hash(input.password, this.SALT_ROUNDS);

    const user = await authRepository.create({
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role as any,
      departmentId: input.departmentId,
    });

    return user;
  }

  /**
   * Refresh access token using a valid refresh token
   */
  async refreshToken(token: string) {
    const storedToken = await authRepository.findRefreshToken(token);
    if (!storedToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (new Date() > storedToken.expiresAt) {
      await authRepository.deleteRefreshToken(token);
      throw new UnauthorizedError('Refresh token has expired');
    }

    const user = storedToken.user;
    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    // Rotate refresh token
    await authRepository.deleteRefreshToken(token);

    const accessToken = this.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = await this.generateRefreshToken(user.id);

    return { accessToken, refreshToken: newRefreshToken };
  }

  /**
   * Logout: invalidate refresh token
   */
  async logout(refreshToken: string) {
    await authRepository.deleteRefreshToken(refreshToken).catch(() => {
      // Token may already be deleted, ignore
    });
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await authRepository.findByEmail(
      (await authRepository.findById(userId))?.email || ''
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isValid = await bcryptjs.compare(input.currentPassword, user.password);
    if (!isValid) {
      throw new BadRequestError('Current password is incorrect');
    }

    const hashedPassword = await bcryptjs.hash(input.newPassword, this.SALT_ROUNDS);
    await authRepository.updatePassword(userId, hashedPassword);

    // Invalidate all refresh tokens (force re-login everywhere)
    await authRepository.deleteAllRefreshTokens(userId);
  }

  /**
   * Get user profile by ID
   */
  async getProfile(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, input: UpdateProfileInput) {
    return authRepository.updateProfile(userId, input);
  }

  /**
   * Get all users (admin)
   */
  async getUsers(params: { page: number; limit: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) {
    const skip = (params.page - 1) * params.limit;
    const where = params.search
      ? {
          OR: [
            { firstName: { contains: params.search, mode: 'insensitive' as const } },
            { lastName: { contains: params.search, mode: 'insensitive' as const } },
            { email: { contains: params.search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const orderBy = params.sortBy
      ? { [params.sortBy]: params.sortOrder || 'desc' }
      : { createdAt: 'desc' as const };

    return authRepository.findAll({
      skip,
      take: params.limit,
      where,
      orderBy,
    });
  }

  // ---- Private Helpers ----

  private generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    } as jwt.SignOptions);
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const token = uuidv4();
    const expiresAt = new Date();
    // Parse refresh token expiry (e.g., "7d" → 7 days)
    const match = env.JWT_REFRESH_EXPIRES_IN.match(/^(\d+)([dhms])$/);
    if (match) {
      const [, value, unit] = match;
      const multipliers: Record<string, number> = {
        d: 24 * 60 * 60 * 1000,
        h: 60 * 60 * 1000,
        m: 60 * 1000,
        s: 1000,
      };
      expiresAt.setTime(expiresAt.getTime() + parseInt(value) * multipliers[unit]);
    } else {
      expiresAt.setDate(expiresAt.getDate() + 7); // Default: 7 days
    }

    await authRepository.createRefreshToken(userId, token, expiresAt);
    return token;
  }
}

export const authService = new AuthService();
