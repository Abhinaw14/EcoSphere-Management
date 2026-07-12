import { Router } from 'express';
import * as socialInitiativeController from '../controllers/social-initiative.controller';
import { validate } from '../../../middlewares/validate';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { createSocialInitiativeSchema, updateSocialInitiativeSchema } from '../validators/social-initiative.validator';

const router = Router();

router.use(authenticateJWT);

router.get('/', socialInitiativeController.getAll);
router.get('/:id', socialInitiativeController.getById);

router.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(createSocialInitiativeSchema),
  socialInitiativeController.create
);

router.put(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(updateSocialInitiativeSchema),
  socialInitiativeController.update
);

router.delete('/:id', authorizeRoles('ADMIN'), socialInitiativeController.deleteItem);

export default router;
