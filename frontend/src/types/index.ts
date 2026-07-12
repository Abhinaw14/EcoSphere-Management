// ============================================================
// EcoSphere — TypeScript Types & Interfaces
// Shared types used across the application
// ============================================================

// ---- Enums ----

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum CategoryType {
  CSR = 'CSR',
  CHALLENGE = 'CHALLENGE',
}

// ---- User ----

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: Role;
  isActive: boolean;
  xpPoints: number;
  departmentId: string | null;
  department?: Department | null;
  createdAt: string;
  updatedAt: string;
}

// ---- Auth ----

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
  departmentId?: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
}

// ---- Department ----

export interface Department {
  id: string;
  name: string;
  code: string;
  headId: string | null;
  parentId: string | null;
  status: Status;
  employeeCount?: number;
  parent?: Department | null;
  children?: Department[];
  createdAt: string;
  updatedAt: string;
}

// ---- Category ----

export interface Category {
  id: string;
  name: string;
  description: string | null;
  type: CategoryType;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

// ---- API Response ----

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
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// ---- Navigation ----

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  roles?: Role[];
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
