// ============================================================
// EcoSphere — User Routes
// ============================================================

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { validate } from '../../../middlewares/validate';
import { updateProfileSchema } from '../validators/auth.validator';

const router = Router();

// All user routes require authentication
router.use(authenticateJWT);

// ---- Profile Routes ----
router.get('/me', authController.getProfile);
router.put('/me', validate(updateProfileSchema), authController.updateProfile);

// ---- Admin Routes ----
router.get('/', authorizeRoles('ADMIN'), authController.getUsers);

export default router;
