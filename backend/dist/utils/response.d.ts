import { Response } from 'express';
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
    meta?: PaginationMeta;
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}
/**
 * Send a successful JSON response
 */
export declare function sendSuccess<T>(res: Response, data: T, message?: string, statusCode?: number, meta?: PaginationMeta): Response;
/**
 * Send a created (201) JSON response
 */
export declare function sendCreated<T>(res: Response, data: T, message?: string): Response;
/**
 * Send an error JSON response
 */
export declare function sendError(res: Response, message?: string, statusCode?: number, errors?: Record<string, string[]>): Response;
/**
 * Parse pagination query params with defaults
 */
export declare function parsePagination(query: Record<string, unknown>): PaginationParams;
/**
 * Build pagination meta from total count
 */
export declare function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta;
//# sourceMappingURL=response.d.ts.map