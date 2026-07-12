// ============================================================
// EcoSphere — Express Server Entry Point
// ============================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';

// Route Imports
import authRoutes from './modules/auth/routes/auth.routes';
import userRoutes from './modules/auth/routes/user.routes';
import departmentRoutes from './modules/departments/routes/department.routes';
import categoryRoutes from './modules/categories/routes/category.routes';
import environmentalRoutes from './modules/environmental/routes/environmental.routes';
import socialRoutes from './modules/social/routes/social.routes';
import governanceRoutes from './modules/governance/routes/governance.routes';
import policyRoutes from './modules/governance/routes/policy.routes';
import governanceAuditRoutes from './modules/governance/routes/governance-audit.routes';
import complianceRoutes from './modules/governance/routes/compliance.routes';

import notificationRoutes from './modules/core/routes/notification.routes';
import reportRoutes from './modules/core/routes/report.routes';
import emissionFactorRoutes from './modules/environmental/routes/emission-factor.routes';
import productProfileRoutes from './modules/environmental/routes/product-profile.routes';
import environmentalGoalRoutes from './modules/environmental/routes/environmental-goal.routes';
import carbonTransactionRoutes from './modules/environmental/routes/carbon-transaction.routes';

import socialInitiativeRoutes from './modules/social/routes/social-initiative.routes';
import socialParticipationRoutes from './modules/social/routes/social-participation.routes';

// Phase 3 Modules
import challengeRoutes from './modules/gamification/routes/challenge.routes';
import badgeRoutes from './modules/gamification/routes/badge.routes';
import leaderboardRoutes from './modules/gamification/routes/leaderboard.routes';
import rewardRoutes from './modules/rewards/routes/reward.routes';

const app = express();

// ============================================================
// GLOBAL MIDDLEWARES
// ============================================================

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// HTTP request logging
if (env.isDev) {
  app.use(morgan('dev'));
}

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '..', env.UPLOAD_DIR)));

// ============================================================
// API ROUTES
// ============================================================

const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/departments`, departmentRoutes);
app.use(`${API_PREFIX}/categories`, categoryRoutes);
app.use(`${API_PREFIX}/environmental`, environmentalRoutes);
app.use(`${API_PREFIX}/emission-factors`, emissionFactorRoutes);
app.use(`${API_PREFIX}/product-profiles`, productProfileRoutes);
app.use(`${API_PREFIX}/environmental-goals`, environmentalGoalRoutes);
app.use(`${API_PREFIX}/carbon-transactions`, carbonTransactionRoutes);
app.use(`${API_PREFIX}/social`, socialRoutes);
app.use(`${API_PREFIX}/social-initiatives`, socialInitiativeRoutes);
app.use(`${API_PREFIX}/social-participations`, socialParticipationRoutes);
app.use(`${API_PREFIX}/governance`, governanceRoutes);
app.use(`${API_PREFIX}/policies`, policyRoutes);
app.use(`${API_PREFIX}/governance-audits`, governanceAuditRoutes);
app.use(`${API_PREFIX}/compliances`, complianceRoutes);

app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/reports`, reportRoutes);

// Gamification & Rewards Routes
app.use(`${API_PREFIX}/challenges`, challengeRoutes);
app.use(`${API_PREFIX}/badges`, badgeRoutes);
app.use(`${API_PREFIX}/leaderboard`, leaderboardRoutes);
app.use(`${API_PREFIX}/rewards`, rewardRoutes);

// Health check
app.get(`${API_PREFIX}/health`, (_req, res) => {
  res.json({
    success: true,
    message: 'EcoSphere API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// ============================================================
// START SERVER
// ============================================================

app.listen(env.PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║                                          ║
  ║   🌍 EcoSphere API Server               ║
  ║                                          ║
  ║   Port:        ${env.PORT}                    ║
  ║   Environment: ${env.NODE_ENV.padEnd(20)}║
  ║   API:         ${`http://localhost:${env.PORT}/api/v1`.padEnd(20)}  ║
  ║                                          ║
  ╚══════════════════════════════════════════╝
  `);
});

export default app;
