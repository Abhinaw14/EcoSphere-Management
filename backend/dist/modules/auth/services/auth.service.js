"use strict";
// ============================================================
// EcoSphere — Auth Service
// Business logic for authentication and user management
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const env_1 = require("../../../config/env");
const auth_repository_1 = require("../repositories/auth.repository");
const errors_1 = require("../../../utils/errors");
class AuthService {
    SALT_ROUNDS = 12;
    /**
     * Authenticate user and return tokens
     */
    async login(input) {
        const user = await auth_repository_1.authRepository.findByEmail(input.email);
        if (!user) {
            throw new errors_1.UnauthorizedError('Invalid email or password');
        }
        if (!user.isActive) {
            throw new errors_1.UnauthorizedError('Account is deactivated');
        }
        const isValidPassword = await bcryptjs_1.default.compare(input.password, user.password);
        if (!isValidPassword) {
            throw new errors_1.UnauthorizedError('Invalid email or password');
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
    async register(input) {
        const existing = await auth_repository_1.authRepository.findByEmail(input.email);
        if (existing) {
            throw new errors_1.ConflictError('User with this email already exists');
        }
        const hashedPassword = await bcryptjs_1.default.hash(input.password, this.SALT_ROUNDS);
        const user = await auth_repository_1.authRepository.create({
            email: input.email,
            password: hashedPassword,
            firstName: input.firstName,
            lastName: input.lastName,
            role: input.role,
            departmentId: input.departmentId,
        });
        return user;
    }
    /**
     * Refresh access token using a valid refresh token
     */
    async refreshToken(token) {
        const storedToken = await auth_repository_1.authRepository.findRefreshToken(token);
        if (!storedToken) {
            throw new errors_1.UnauthorizedError('Invalid refresh token');
        }
        if (new Date() > storedToken.expiresAt) {
            await auth_repository_1.authRepository.deleteRefreshToken(token);
            throw new errors_1.UnauthorizedError('Refresh token has expired');
        }
        const user = storedToken.user;
        if (!user.isActive) {
            throw new errors_1.UnauthorizedError('Account is deactivated');
        }
        // Rotate refresh token
        await auth_repository_1.authRepository.deleteRefreshToken(token);
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
    async logout(refreshToken) {
        await auth_repository_1.authRepository.deleteRefreshToken(refreshToken).catch(() => {
            // Token may already be deleted, ignore
        });
    }
    /**
     * Change password for authenticated user
     */
    async changePassword(userId, input) {
        const user = await auth_repository_1.authRepository.findByEmail((await auth_repository_1.authRepository.findById(userId))?.email || '');
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        const isValid = await bcryptjs_1.default.compare(input.currentPassword, user.password);
        if (!isValid) {
            throw new errors_1.BadRequestError('Current password is incorrect');
        }
        const hashedPassword = await bcryptjs_1.default.hash(input.newPassword, this.SALT_ROUNDS);
        await auth_repository_1.authRepository.updatePassword(userId, hashedPassword);
        // Invalidate all refresh tokens (force re-login everywhere)
        await auth_repository_1.authRepository.deleteAllRefreshTokens(userId);
    }
    /**
     * Get user profile by ID
     */
    async getProfile(userId) {
        const user = await auth_repository_1.authRepository.findById(userId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        return user;
    }
    /**
     * Update user profile
     */
    async updateProfile(userId, input) {
        return auth_repository_1.authRepository.updateProfile(userId, input);
    }
    /**
     * Get all users (admin)
     */
    async getUsers(params) {
        const skip = (params.page - 1) * params.limit;
        const where = params.search
            ? {
                OR: [
                    { firstName: { contains: params.search, mode: 'insensitive' } },
                    { lastName: { contains: params.search, mode: 'insensitive' } },
                    { email: { contains: params.search, mode: 'insensitive' } },
                ],
            }
            : undefined;
        const orderBy = params.sortBy
            ? { [params.sortBy]: params.sortOrder || 'desc' }
            : { createdAt: 'desc' };
        return auth_repository_1.authRepository.findAll({
            skip,
            take: params.limit,
            where,
            orderBy,
        });
    }
    // ---- Private Helpers ----
    generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, {
            expiresIn: env_1.env.JWT_EXPIRES_IN,
        });
    }
    async generateRefreshToken(userId) {
        const token = (0, uuid_1.v4)();
        const expiresAt = new Date();
        // Parse refresh token expiry (e.g., "7d" → 7 days)
        const match = env_1.env.JWT_REFRESH_EXPIRES_IN.match(/^(\d+)([dhms])$/);
        if (match) {
            const [, value, unit] = match;
            const multipliers = {
                d: 24 * 60 * 60 * 1000,
                h: 60 * 60 * 1000,
                m: 60 * 1000,
                s: 1000,
            };
            expiresAt.setTime(expiresAt.getTime() + parseInt(value) * multipliers[unit]);
        }
        else {
            expiresAt.setDate(expiresAt.getDate() + 7); // Default: 7 days
        }
        await auth_repository_1.authRepository.createRefreshToken(userId, token, expiresAt);
        return token;
    }
}
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map