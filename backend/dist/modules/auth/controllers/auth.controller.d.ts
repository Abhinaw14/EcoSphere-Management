import { Request, Response, NextFunction } from 'express';
declare class AuthController {
    /**
     * POST /api/v1/auth/login
     */
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/auth/register
     */
    register(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/auth/refresh
     */
    refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/v1/auth/logout
     */
    logout(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PUT /api/v1/auth/change-password
     */
    changePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/users/me
     */
    getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PUT /api/v1/users/me
     */
    updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/v1/users
     */
    getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const authController: AuthController;
export {};
//# sourceMappingURL=auth.controller.d.ts.map