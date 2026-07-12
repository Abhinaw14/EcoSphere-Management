import { Router } from 'express';
import * as badgeController from '../controllers/badge.controller';
import { validate } from '../../../middlewares/validate';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { createBadgeSchema, updateBadgeSchema } from '../validators/badge.validator';

const router = Router();

router.use(authenticateJWT);

router.get('/', badgeController.getAll);
router.get('/:id', badgeController.getById);

router.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(createBadgeSchema),
  badgeController.create
);

router.put(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(updateBadgeSchema),
  badgeController.update
);

router.delete('/:id', authorizeRoles('ADMIN'), badgeController.deleteItem);

export default router;
