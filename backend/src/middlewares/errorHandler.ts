// ============================================================
// EcoSphere — Global Error Handling Middleware
// Catches all errors and sends standardized responses
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import { sendError } from '../utils/response';
import { env } from '../config/env';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log errors in development
  if (env.isDev) {
    console.error('🔥 Error:', err);
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    (err.issues || []).forEach((e: any) => {
      const path = (e.path || []).join('.');
      if (!errors[path]) errors[path] = [];
      errors[path].push(e.message);
    });
    sendError(res, 'Validation failed', 422, errors);
    return;
  }

  // Custom validation errors
  if (err instanceof ValidationError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  // Custom application errors
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Prisma known errors
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any;
    if (prismaErr.code === 'P2002') {
      sendError(res, 'A record with this value already exists', 409);
      return;
    }
    if (prismaErr.code === 'P2025') {
      sendError(res, 'Record not found', 404);
      return;
    }
  }

  // Unknown errors
  sendError(
    res,
    env.isDev ? err.message : 'Internal server error',
    500
  );
}
