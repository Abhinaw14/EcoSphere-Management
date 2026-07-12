"use strict";
// ============================================================
// EcoSphere — JWT Authentication Middleware
// Verifies JWT tokens and attaches user to request
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = authenticateJWT;
exports.authorizeRoles = authorizeRoles;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const errors_1 = require("../utils/errors");
/**
 * Middleware: Verify JWT access token from Authorization header
 */
function authenticateJWT(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new errors_1.UnauthorizedError('Access token is required'));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return next(new errors_1.UnauthorizedError('Token has expired'));
        }
        return next(new errors_1.UnauthorizedError('Invalid token'));
    }
}
/**
 * Middleware: Restrict access to specific roles
 * Must be used AFTER authenticateJWT
 */
function authorizeRoles(...allowedRoles) {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new errors_1.UnauthorizedError('Authentication required'));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new errors_1.ForbiddenError('You do not have permission to access this resource'));
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map