"use strict";
// ============================================================
// EcoSphere — Auth Repository
// Database operations for authentication
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = exports.AuthRepository = void 0;
const database_1 = __importDefault(require("../../../config/database"));
class AuthRepository {
    /**
     * Find user by email (includes password for auth)
     */
    async findByEmail(email) {
        return database_1.default.user.findUnique({ where: { email } });
    }
    /**
     * Find user by ID (excludes password)
     */
    async findById(id) {
        return database_1.default.user.findUnique({
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
    async create(data) {
        return database_1.default.user.create({
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
    async updatePassword(userId, hashedPassword) {
        return database_1.default.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    }
    /**
     * Update user profile
     */
    async updateProfile(userId, data) {
        return database_1.default.user.update({
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
    async findAll(params) {
        const [users, total] = await Promise.all([
            database_1.default.user.findMany({
                skip: params.skip,
                take: params.take,
                where: params.where,
                orderBy: params.orderBy,
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
            database_1.default.user.count({ where: params.where }),
        ]);
        return { users, total };
    }
    // ---- Refresh Token Operations ----
    /**
     * Create a refresh token
     */
    async createRefreshToken(userId, token, expiresAt) {
        return database_1.default.refreshToken.create({
            data: { token, userId, expiresAt },
        });
    }
    /**
     * Find refresh token by token string
     */
    async findRefreshToken(token) {
        return database_1.default.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });
    }
    /**
     * Delete a specific refresh token
     */
    async deleteRefreshToken(token) {
        return database_1.default.refreshToken.delete({ where: { token } });
    }
    /**
     * Delete all refresh tokens for a user
     */
    async deleteAllRefreshTokens(userId) {
        return database_1.default.refreshToken.deleteMany({ where: { userId } });
    }
}
exports.AuthRepository = AuthRepository;
exports.authRepository = new AuthRepository();
//# sourceMappingURL=auth.repository.js.map