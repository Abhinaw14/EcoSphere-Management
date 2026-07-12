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

export enum EnvironmentalType {
  CARBON = 'CARBON',
  ENERGY = 'ENERGY',
  WATER = 'WATER',
  WASTE = 'WASTE',
}

export enum AuditStatus {
  PENDING = 'PENDING',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
}

export enum PolicyStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  PENDING = 'PENDING',
}

export enum InitiativeStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum GoalStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  ACHIEVED = 'ACHIEVED',
  MISSED = 'MISSED',
}

export enum TransactionType {
  OFFSET = 'OFFSET',
  CREDIT = 'CREDIT',
  EMISSION = 'EMISSION',
}

export enum ChallengeStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  UPCOMING = 'UPCOMING',
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

// ---- ESG Models ----

export interface EnvironmentalMetric {
  id: string;
  type: EnvironmentalType;
  value: number;
  unit: string;
  recordedAt: string;
  departmentId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  department?: Department;
  user?: User;
}



export interface GovernanceAudit {
  id: string;
  title: string;
  status: AuditStatus;
  auditorId: string;
  departmentId: string;
  scheduledDate: string;
  completedDate: string | null;
  createdAt: string;
  updatedAt: string;
  auditor?: User;
  department?: Department;
}

export interface Policy {
  id: string;
  title: string;
  description?: string | null;
  version: string;
  status: PolicyStatus;
  validUntil?: string | null;
  createdAt: string;
  updatedAt: string;
  compliances?: ComplianceRecord[];
  _count?: {
    compliances: number;
  };
}

export interface ComplianceRecord {
  id: string;
  policyId: string;
  departmentId: string;
  status: ComplianceStatus;
  notes?: string | null;
  assessedAt: string;
  createdAt: string;
  updatedAt: string;
  policy?: Policy;
  department?: Department;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface EmissionFactor {
  id: string;
  source: string;
  factor: number;
  unit: string;
  gasType: string;
  region?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductProfile {
  id: string;
  name: string;
  description?: string;
  category: string;
  carbonFootprint: number;
  waterUsage: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnvironmentalGoal {
  id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  departmentId: string;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
  department?: Department;
}

export interface CarbonTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description?: string;
  departmentId?: string;
  createdAt: string;
  updatedAt: string;
  department?: Department;
}

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  xpReward: number;
  startDate: string;
  endDate: string;
  status: ChallengeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description?: string;
  icon: string;
  xpThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reward {
  id: string;
  name: string;
  description?: string;
  xpCost: number;
  stock: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RewardRedemption {
  id: string;
  userId: string;
  rewardId: string;
  redeemedAt: string;
  reward?: Reward;
  user?: User;
}

export interface SocialInitiative {
  id: string;
  title: string;
  description?: string | null;
  participantsCount: number;
  hoursLogged: number;
  status: InitiativeStatus;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
  department?: Department;
  _count?: {
    participations: number;
  };
}

export interface SocialParticipation {
  id: string;
  userId: string;
  initiativeId: string;
  hoursLogged: number;
  status: Status;
  createdAt: string;
  updatedAt: string;
  user?: User;
  initiative?: SocialInitiative;
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
