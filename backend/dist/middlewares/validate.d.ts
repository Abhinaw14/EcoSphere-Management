import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
type ValidationTarget = 'body' | 'params' | 'query';
/**
 * Creates middleware that validates request data against a Zod schema
 */
export declare function validate(schema: ZodSchema, target?: ValidationTarget): (req: Request, _res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=validate.d.ts.map