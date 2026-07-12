import { Router } from 'express';
import * as socialController from '../controllers/social.controller';
import { validate } from '../../../middlewares/validate';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { createSocialSchema, updateSocialSchema } from '../validators/social.validator';

const router = Router();

// Apply auth middleware to all routes
router.use(authenticateJWT);

// GET /api/v1/social
router.get('/', socialController.getAllInitiatives);

// GET /api/v1/social/:id
router.get('/:id', socialController.getInitiativeById);

// POST /api/v1/social
router.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(createSocialSchema),
  socialController.createInitiative
);

// PUT /api/v1/social/:id
router.put(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(updateSocialSchema),
  socialController.updateInitiative
);

// DELETE /api/v1/social/:id
router.delete('/:id', authorizeRoles('ADMIN'), socialController.deleteInitiative);

export default router;
