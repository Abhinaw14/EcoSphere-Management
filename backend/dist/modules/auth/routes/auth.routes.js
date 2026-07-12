"use strict";
// ============================================================
// EcoSphere — Auth Routes
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../../../middlewares/auth");
const validate_1 = require("../../../middlewares/validate");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
// ---- Public Routes ----
router.post('/login', (0, validate_1.validate)(auth_validator_1.loginSchema), auth_controller_1.authController.login);
router.post('/refresh', auth_controller_1.authController.refreshToken);
router.post('/logout', auth_controller_1.authController.logout);
// ---- Protected Routes ----
router.post('/register', auth_1.authenticateJWT, (0, auth_1.authorizeRoles)('ADMIN'), (0, validate_1.validate)(auth_validator_1.registerSchema), auth_controller_1.authController.register);
router.put('/change-password', auth_1.authenticateJWT, (0, validate_1.validate)(auth_validator_1.changePasswordSchema), auth_controller_1.authController.changePassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map