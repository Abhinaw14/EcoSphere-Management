"use strict";
// ============================================================
// EcoSphere — API Response Helpers
// Standardized response format for all API endpoints
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendCreated = sendCreated;
exports.sendError = sendError;
exports.parsePagination = parsePagination;
exports.buildPaginationMeta = buildPaginationMeta;
/**
 * Send a successful JSON response
 */
function sendSuccess(res, data, message = 'Success', statusCode = 200, meta) {
    const response = { success: true, message, data };
    if (meta)
        response.meta = meta;
    return res.status(statusCode).json(response);
}
/**
 * Send a created (201) JSON response
 */
function sendCreated(res, data, message = 'Created successfully') {
    return sendSuccess(res, data, message, 201);
}
/**
 * Send an error JSON response
 */
function sendError(res, message = 'Something went wrong', statusCode = 500, errors) {
    const response = { success: false, message };
    if (errors)
        response.errors = errors;
    return res.status(statusCode).json(response);
}
/**
 * Parse pagination query params with defaults
 */
function parsePagination(query) {
    return {
        page: Math.max(1, parseInt(String(query.page || '1'), 10)),
        limit: Math.min(100, Math.max(1, parseInt(String(query.limit || '10'), 10))),
        sortBy: String(query.sortBy || 'createdAt'),
        sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
        search: query.search ? String(query.search) : undefined,
    };
}
/**
 * Build pagination meta from total count
 */
function buildPaginationMeta(total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
}
//# sourceMappingURL=response.js.map