import { Role } from '@prisma/client';
export declare class AuthRepository {
    /**
     * Find user by email (includes password for auth)
     */
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        xpPoints: number;
        departmentId: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    /**
     * Find user by ID (excludes password)
     */
    findById(id: string): Promise<{
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
    } | null>;
    /**
     * Create a new user
     */
    create(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: Role;
        departmentId?: string | null;
    }): Promise<{
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
     * Update user password
     */
    updatePassword(userId: string, hashedPassword: string): Promise<{
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        xpPoints: number;
        departmentId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Update user profile
     */
    updateProfile(userId: string, data: {
        firstName?: string;
        lastName?: string;
        avatarUrl?: string | null;
    }): Promise<{
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
     * Find all users with pagination
     */
    findAll(params: {
        skip: number;
        take: number;
        where?: object;
        orderBy?: object;
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
    /**
     * Create a refresh token
     */
    createRefreshToken(userId: string, token: string, expiresAt: Date): Promise<{
        id: string;
        token: string;
        userId: string;
        expiresAt: Date;
        createdAt: Date;
    }>;
    /**
     * Find refresh token by token string
     */
    findRefreshToken(token: string): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            xpPoints: number;
            departmentId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        token: string;
        userId: string;
        expiresAt: Date;
        createdAt: Date;
    }) | null>;
    /**
     * Delete a specific refresh token
     */
    deleteRefreshToken(token: string): Promise<{
        id: string;
        token: string;
        userId: string;
        expiresAt: Date;
        createdAt: Date;
    }>;
    /**
     * Delete all refresh tokens for a user
     */
    deleteAllRefreshTokens(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
export declare const authRepository: AuthRepository;
//# sourceMappingURL=auth.repository.d.ts.map