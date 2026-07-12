"use strict";
// ============================================================
// EcoSphere — User Routes
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../../../middlewares/auth");
const validate_1 = require("../../../middlewares/validate");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
// All user routes require authentication
router.use(auth_1.authenticateJWT);
// ---- Profile Routes ----
router.get('/me', auth_controller_1.authController.getProfile);
router.put('/me', (0, validate_1.validate)(auth_validator_1.updateProfileSchema), auth_controller_1.authController.updateProfile);
// ---- Admin Routes ----
router.get('/', (0, auth_1.authorizeRoles)('ADMIN'), auth_controller_1.authController.getUsers);
exports.default = router;
//# sourceMappingURL=user.routes.js.map