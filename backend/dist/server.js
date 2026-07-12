"use strict";
// ============================================================
// EcoSphere — Express Server Entry Point
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middlewares/errorHandler");
// Route Imports
const auth_routes_1 = __importDefault(require("./modules/auth/routes/auth.routes"));
const user_routes_1 = __importDefault(require("./modules/auth/routes/user.routes"));
const app = (0, express_1.default)();
// ============================================================
// GLOBAL MIDDLEWARES
// ============================================================
// Security headers
app.use((0, helmet_1.default)());
// CORS
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// HTTP request logging
if (env_1.env.isDev) {
    app.use((0, morgan_1.default)('dev'));
}
// Static file serving for uploads
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', env_1.env.UPLOAD_DIR)));
// ============================================================
// API ROUTES
// ============================================================
const API_PREFIX = '/api/v1';
app.use(`${API_PREFIX}/auth`, auth_routes_1.default);
app.use(`${API_PREFIX}/users`, user_routes_1.default);
// Health check
app.get(`${API_PREFIX}/health`, (_req, res) => {
    res.json({
        success: true,
        message: 'EcoSphere API is running',
        timestamp: new Date().toISOString(),
        environment: env_1.env.NODE_ENV,
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
app.use(errorHandler_1.errorHandler);
// ============================================================
// START SERVER
// ============================================================
app.listen(env_1.env.PORT, () => {
    console.log(`
  ╔══════════════════════════════════════════╗
  ║                                          ║
  ║   🌍 EcoSphere API Server               ║
  ║                                          ║
  ║   Port:        ${env_1.env.PORT}                    ║
  ║   Environment: ${env_1.env.NODE_ENV.padEnd(20)}║
  ║   API:         ${`http://localhost:${env_1.env.PORT}/api/v1`.padEnd(20)}  ║
  ║                                          ║
  ╚══════════════════════════════════════════╝
  `);
});
exports.default = app;
//# sourceMappingURL=server.js.map