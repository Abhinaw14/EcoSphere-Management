// ============================================================
// EcoSphere — App Root Component
// Router configuration with layouts and protected routes
// ============================================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import PublicLayout from '@/layouts/PublicLayout';

// Guards
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Pages
import LandingPage from '@/pages/public/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import DepartmentsPage from '@/pages/departments/DepartmentsPage';
import CategoriesPage from '@/pages/categories/CategoriesPage';
import EnvironmentalPage from '@/pages/environmental/EnvironmentalPage';
import EmissionFactorsPage from '@/pages/environmental/EmissionFactorsPage';
import ProductProfilesPage from '@/pages/environmental/ProductProfilesPage';
import EnvironmentalGoalsPage from '@/pages/environmental/EnvironmentalGoalsPage';
import CarbonTransactionsPage from '@/pages/environmental/CarbonTransactionsPage';
import InteractiveMapPage from '@/pages/environmental/InteractiveMapPage';
import SocialPage from '@/pages/social/SocialPage';
import CSRActivitiesPage from '@/pages/social/CSRActivitiesPage';
import ParticipationsPage from '@/pages/social/ParticipationsPage';

import GovernancePage from '@/pages/governance/GovernancePage';
import PoliciesPage from '@/pages/governance/PoliciesPage';
import AuditsPage from '@/pages/governance/AuditsPage';
import CompliancePage from '@/pages/governance/CompliancePage';

import ChallengesPage from '@/pages/gamification/ChallengesPage';
import BadgesPage from '@/pages/gamification/BadgesPage';
import LeaderboardPage from '@/pages/gamification/LeaderboardPage';
import VirtualForestPage from '@/pages/gamification/VirtualForestPage';
import RewardsPage from '@/pages/rewards/RewardsPage';

import ReportsPage from '@/pages/ReportsPage';
import NotificationsPage from '@/pages/NotificationsPage';

import { ROUTES } from '@/constants/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path={ROUTES.HOME} element={<LandingPage />} />
              </Route>

              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route
                  path={ROUTES.FORGOT_PASSWORD}
                  element={<div className="text-center text-muted-foreground">Forgot Password — Coming Soon</div>}
                />
                <Route
                  path={ROUTES.RESET_PASSWORD}
                  element={<div className="text-center text-muted-foreground">Reset Password — Coming Soon</div>}
                />
              </Route>

              {/* Protected Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                <Route path={ROUTES.DEPARTMENTS} element={<DepartmentsPage />} />
                <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
                <Route path={ROUTES.ENVIRONMENTAL} element={<EnvironmentalPage />} />
                <Route path="/environmental/map" element={<InteractiveMapPage />} />
                <Route path={ROUTES.EMISSION_FACTORS} element={<EmissionFactorsPage />} />
                <Route path={ROUTES.PRODUCT_PROFILES} element={<ProductProfilesPage />} />
                <Route path={ROUTES.ENVIRONMENTAL_GOALS} element={<EnvironmentalGoalsPage />} />
                <Route path={ROUTES.CARBON_TRANSACTIONS} element={<CarbonTransactionsPage />} />
                <Route path={ROUTES.SOCIAL} element={<SocialPage />} />
                <Route path={ROUTES.CSR_ACTIVITIES} element={<CSRActivitiesPage />} />
                <Route path={ROUTES.PARTICIPATIONS} element={<ParticipationsPage />} />
                <Route path={ROUTES.GOVERNANCE} element={<GovernancePage />} />
                <Route path={ROUTES.POLICIES} element={<PoliciesPage />} />
                <Route path={ROUTES.AUDITS} element={<AuditsPage />} />
                <Route path={ROUTES.COMPLIANCE} element={<CompliancePage />} />
                <Route path={ROUTES.GAMIFICATION} element={<PlaceholderPage title="Gamification" />} />
                <Route path={ROUTES.CHALLENGES} element={<ChallengesPage />} />
                <Route path={ROUTES.BADGES} element={<BadgesPage />} />
                <Route path={ROUTES.LEADERBOARD} element={<LeaderboardPage />} />
                <Route path="/gamification/forest" element={<VirtualForestPage />} />
                <Route path={ROUTES.REWARDS} element={<RewardsPage />} />
                <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
                <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
                <Route path={ROUTES.PROFILE} element={<PlaceholderPage title="User Profile" />} />
                <Route path={ROUTES.SETTINGS} element={<PlaceholderPage title="Settings" />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Routes>
          </BrowserRouter>

          <Toaster
            position="top-right"
            toastOptions={{
              className: 'bg-popover text-popover-foreground border border-border',
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Temporary placeholder for modules not yet built
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-4">
        <span className="text-2xl text-white">🚀</span>
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md">
        This module is coming soon. It will be built incrementally as part of the
        EcoSphere platform.
      </p>
    </div>
  );
}
