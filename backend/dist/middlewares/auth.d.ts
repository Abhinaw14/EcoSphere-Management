import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
export interface JwtPayload {
    userId: string;
    email: string;
    role: Role;
}
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
/**
 * Middleware: Verify JWT access token from Authorization header
 */
export declare function authenticateJWT(req: Request, _res: Response, next: NextFunction): void;
/**
 * Middleware: Restrict access to specific roles
 * Must be used AFTER authenticateJWT
 */
export declare function authorizeRoles(...allowedRoles: Role[]): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map