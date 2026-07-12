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
