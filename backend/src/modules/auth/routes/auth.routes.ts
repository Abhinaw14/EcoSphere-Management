// ============================================================
// EcoSphere — Auth Routes
// ============================================================

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { validate } from '../../../middlewares/validate';
import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  updateProfileSchema,
} from '../validators/auth.validator';

const router = Router();

// ---- Public Routes ----
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

// ---- Protected Routes ----
router.post(
  '/register',
  authenticateJWT,
  authorizeRoles('ADMIN'),
  validate(registerSchema),
  authController.register
);

router.put(
  '/change-password',
  authenticateJWT,
  validate(changePasswordSchema),
  authController.changePassword
);

export default router;
