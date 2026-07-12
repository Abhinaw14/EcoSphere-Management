import type { LoginInput, RegisterInput, ChangePasswordInput, UpdateProfileInput } from '../validators/auth.validator';
declare class AuthService {
    private readonly SALT_ROUNDS;
    /**
     * Authenticate user and return tokens
     */
    login(input: LoginInput): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
            role: import(".prisma/client").$Enums.Role;
            xpPoints: number;
            departmentId: string | null;
        };
    }>;
    /**
     * Register a new user (admin-only operation)
     */
    register(input: RegisterInput): Promise<{
        createdAt: Date;
        departmentId: string | null;
        email: string;
        firstName: string;
        id: string;
        isActive: boolean;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        xpPoints: number;
    }>;
    /**
     * Refresh access token using a valid refresh token
     */
    refreshToken(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    /**
     * Logout: invalidate refresh token
     */
    logout(refreshToken: string): Promise<void>;
    /**
     * Change password for authenticated user
     */
    changePassword(userId: string, input: ChangePasswordInput): Promise<void>;
    /**
     * Get user profile by ID
     */
    getProfile(userId: string): Promise<{
        avatarUrl: string | null;
        createdAt: Date;
        department: {
            code: string;
            id: string;
            name: string;
        } | null;
        departmentId: string | null;
        email: string;
        firstName: string;
        id: string;
        isActive: boolean;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        updatedAt: Date;
        xpPoints: number;
    }>;
    /**
     * Update user profile
     */
    updateProfile(userId: string, input: UpdateProfileInput): Promise<{
        avatarUrl: string | null;
        createdAt: Date;
        department: {
            code: string;
            id: string;
            name: string;
        } | null;
        departmentId: string | null;
        email: string;
        firstName: string;
        id: string;
        isActive: boolean;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        updatedAt: Date;
        xpPoints: number;
    }>;
    /**
     * Get all users (admin)
     */
    getUsers(params: {
        page: number;
        limit: number;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        users: {
            avatarUrl: string | null;
            createdAt: Date;
            department: {
                code: string;
                id: string;
                name: string;
            } | null;
            departmentId: string | null;
            email: string;
            firstName: string;
            id: string;
            isActive: boolean;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            updatedAt: Date;
            xpPoints: number;
        }[];
        total: number;
    }>;
    private generateAccessToken;
    private generateRefreshToken;
}
export declare const authService: AuthService;
export {};
//# sourceMappingURL=auth.service.d.ts.map