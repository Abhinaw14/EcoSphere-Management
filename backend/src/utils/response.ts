// ============================================================
// EcoSphere — API Response Helpers
// Standardized response format for all API endpoints
// ============================================================

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
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: PaginationMeta
): Response {
  const response: ApiResponse<T> = { success: true, message, data };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
}

/**
 * Send a created (201) JSON response
 */
export function sendCreated<T>(
  res: Response,
  data: T,
  message = 'Created successfully'
): Response {
  return sendSuccess(res, data, message, 201);
}

/**
 * Send an error JSON response
 */
export function sendError(
  res: Response,
  message = 'Something went wrong',
  statusCode = 500,
  errors?: Record<string, string[]>
): Response {
  const response: ApiResponse = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
}

/**
 * Parse pagination query params with defaults
 */
export function parsePagination(query: Record<string, unknown>): PaginationParams {
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
export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
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
