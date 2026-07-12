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

// Guards
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Pages
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';

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

                {/* Placeholder routes for future modules */}
                <Route path={ROUTES.DEPARTMENTS} element={<PlaceholderPage title="Departments" />} />
                <Route path={ROUTES.CATEGORIES} element={<PlaceholderPage title="Categories" />} />
                <Route path={ROUTES.ENVIRONMENTAL} element={<PlaceholderPage title="Environmental" />} />
                <Route path={ROUTES.SOCIAL} element={<PlaceholderPage title="Social" />} />
                <Route path={ROUTES.GOVERNANCE} element={<PlaceholderPage title="Governance" />} />
                <Route path={ROUTES.GAMIFICATION} element={<PlaceholderPage title="Gamification" />} />
                <Route path={ROUTES.CHALLENGES} element={<PlaceholderPage title="Challenges" />} />
                <Route path={ROUTES.BADGES} element={<PlaceholderPage title="Badges" />} />
                <Route path={ROUTES.LEADERBOARD} element={<PlaceholderPage title="Leaderboard" />} />
                <Route path={ROUTES.REWARDS} element={<PlaceholderPage title="Rewards" />} />
                <Route path={ROUTES.REPORTS} element={<PlaceholderPage title="Reports" />} />
                <Route path={ROUTES.NOTIFICATIONS} element={<PlaceholderPage title="Notifications" />} />
                <Route path={ROUTES.PROFILE} element={<PlaceholderPage title="Profile" />} />
                <Route path={ROUTES.SETTINGS} element={<PlaceholderPage title="Settings" />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
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
