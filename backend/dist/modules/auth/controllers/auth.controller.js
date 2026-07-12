"use strict";
// ============================================================
// EcoSphere — Auth Controller
// Handles HTTP requests/responses for authentication
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../../../utils/response");
class AuthController {
    /**
     * POST /api/v1/auth/login
     */
    async login(req, res, next) {
        try {
            const result = await auth_service_1.authService.login(req.body);
            (0, response_1.sendSuccess)(res, result, 'Login successful');
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/auth/register
     */
    async register(req, res, next) {
        try {
            const user = await auth_service_1.authService.register(req.body);
            (0, response_1.sendCreated)(res, user, 'User registered successfully');
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/auth/refresh
     */
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await auth_service_1.authService.refreshToken(refreshToken);
            (0, response_1.sendSuccess)(res, result, 'Token refreshed successfully');
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/auth/logout
     */
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.body;
            await auth_service_1.authService.logout(refreshToken);
            (0, response_1.sendSuccess)(res, null, 'Logged out successfully');
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PUT /api/v1/auth/change-password
     */
    async changePassword(req, res, next) {
        try {
            await auth_service_1.authService.changePassword(req.user.userId, req.body);
            (0, response_1.sendSuccess)(res, null, 'Password changed successfully');
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/users/me
     */
    async getProfile(req, res, next) {
        try {
            const user = await auth_service_1.authService.getProfile(req.user.userId);
            (0, response_1.sendSuccess)(res, user);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PUT /api/v1/users/me
     */
    async updateProfile(req, res, next) {
        try {
            const user = await auth_service_1.authService.updateProfile(req.user.userId, req.body);
            (0, response_1.sendSuccess)(res, user, 'Profile updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/users
     */
    async getUsers(req, res, next) {
        try {
            const pagination = (0, response_1.parsePagination)(req.query);
            const { users, total } = await auth_service_1.authService.getUsers(pagination);
            const meta = (0, response_1.buildPaginationMeta)(total, pagination.page, pagination.limit);
            (0, response_1.sendSuccess)(res, users, 'Users fetched successfully', 200, meta);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map