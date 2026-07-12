// ============================================================
// EcoSphere — Auth Layout
// Centered card layout for login/forgot-password flows
// ============================================================

import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import EcoSphereCanvas from '@/components/3d/EcoSphereCanvas';

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      {/* 3D Background */}
      <EcoSphereCanvas />

      {/* Subtle overlay gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary mb-4 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">EcoSphere</h1>
          <p className="text-sm text-muted-foreground mt-1">
            ESG Management Platform
          </p>
        </div>

        {/* Content Card */}
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-xl">
          <Outlet />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} EcoSphere. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
