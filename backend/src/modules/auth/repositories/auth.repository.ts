// ============================================================
// EcoSphere — Auth Repository
// Database operations for authentication
// ============================================================

import prisma from '../../../config/database';
import { Role } from '@prisma/client';

export class AuthRepository {
  /**
   * Find user by email (includes password for auth)
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  /**
   * Find user by ID (excludes password)
   */
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        xpPoints: true,
        departmentId: true,
        department: { select: { id: true, name: true, code: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Create a new user
   */
  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: Role;
    departmentId?: string | null;
  }) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        xpPoints: true,
        departmentId: true,
        createdAt: true,
      },
    });
  }

  /**
   * Update user password
   */
  async updatePassword(userId: string, hashedPassword: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: { firstName?: string; lastName?: string; avatarUrl?: string | null }) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        xpPoints: true,
        departmentId: true,
        department: { select: { id: true, name: true, code: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Find all users with pagination
   */
  async findAll(params: {
    skip: number;
    take: number;
    where?: object;
    orderBy?: object;
  }) {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: params.orderBy as any,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          role: true,
          isActive: true,
          xpPoints: true,
          departmentId: true,
          department: { select: { id: true, name: true, code: true } },
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where: params.where }),
    ]);
    return { users, total };
  }

  // ---- Refresh Token Operations ----

  /**
   * Create a refresh token
   */
  async createRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: { token, userId, expiresAt },
    });
  }

  /**
   * Find refresh token by token string
   */
  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  /**
   * Delete a specific refresh token
   */
  async deleteRefreshToken(token: string) {
    return prisma.refreshToken.delete({ where: { token } });
  }

  /**
   * Delete all refresh tokens for a user
   */
  async deleteAllRefreshTokens(userId: string) {
    return prisma.refreshToken.deleteMany({ where: { userId } });
  }
}

export const authRepository = new AuthRepository();
