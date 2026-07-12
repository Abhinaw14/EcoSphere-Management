"use strict";
// ============================================================
// EcoSphere — Global Error Handling Middleware
// Catches all errors and sends standardized responses
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
const env_1 = require("../config/env");
const zod_1 = require("zod");
function errorHandler(err, _req, res, _next) {
    // Log errors in development
    if (env_1.env.isDev) {
        console.error('🔥 Error:', err);
    }
    // Zod validation errors
    if (err instanceof zod_1.ZodError) {
        const errors = {};
        (err.issues || []).forEach((e) => {
            const path = (e.path || []).join('.');
            if (!errors[path])
                errors[path] = [];
            errors[path].push(e.message);
        });
        (0, response_1.sendError)(res, 'Validation failed', 422, errors);
        return;
    }
    // Custom validation errors
    if (err instanceof errors_1.ValidationError) {
        (0, response_1.sendError)(res, err.message, err.statusCode, err.errors);
        return;
    }
    // Custom application errors
    if (err instanceof errors_1.AppError) {
        (0, response_1.sendError)(res, err.message, err.statusCode);
        return;
    }
    // Prisma known errors
    if (err.constructor.name === 'PrismaClientKnownRequestError') {
        const prismaErr = err;
        if (prismaErr.code === 'P2002') {
            (0, response_1.sendError)(res, 'A record with this value already exists', 409);
            return;
        }
        if (prismaErr.code === 'P2025') {
            (0, response_1.sendError)(res, 'Record not found', 404);
            return;
        }
    }
    // Unknown errors
    (0, response_1.sendError)(res, env_1.env.isDev ? err.message : 'Internal server error', 500);
}
//# sourceMappingURL=errorHandler.js.map