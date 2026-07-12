// ============================================================
// EcoSphere — Zod Validation Middleware
// Validates request body, params, or query against Zod schemas
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

type ValidationTarget = 'body' | 'params' | 'query';

/**
 * Creates middleware that validates request data against a Zod schema
 */
export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      return next(result.error);
    }
    // Replace request data with parsed (and transformed) data
    req[target] = result.data;
    next();
  };
}
