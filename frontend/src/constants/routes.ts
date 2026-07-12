// ============================================================
// EcoSphere — Route Constants
// ============================================================

export const ROUTES = {
  // Auth
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  HOME: '/',
  // Dashboard
  DASHBOARD: '/dashboard',

  // Departments
  DEPARTMENTS: '/departments',
  DEPARTMENT_CREATE: '/departments/new',
  DEPARTMENT_EDIT: '/departments/:id/edit',
  DEPARTMENT_DETAIL: '/departments/:id',

  // Categories
  CATEGORIES: '/categories',

  // Environmental
  ENVIRONMENTAL: '/environmental',
  EMISSION_FACTORS: '/environmental/emission-factors',
  PRODUCT_PROFILES: '/environmental/product-profiles',
  ENVIRONMENTAL_GOALS: '/environmental/goals',
  CARBON_TRANSACTIONS: '/environmental/carbon-transactions',

  // Social
  SOCIAL: '/social',
  CSR_ACTIVITIES: '/social/csr-activities',
  PARTICIPATIONS: '/social/participations',

  // Governance
  GOVERNANCE: '/governance',
  POLICIES: '/governance/policies',
  AUDITS: '/governance/audits',
  COMPLIANCE: '/governance/compliance',

  // Gamification
  GAMIFICATION: '/gamification',
  CHALLENGES: '/gamification/challenges',
  BADGES: '/gamification/badges',
  LEADERBOARD: '/gamification/leaderboard',

  // Rewards
  REWARDS: '/rewards',

  // Reports
  REPORTS: '/reports',

  // Notifications
  NOTIFICATIONS: '/notifications',

  // Profile
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
  SETTINGS: '/settings',
} as const;
