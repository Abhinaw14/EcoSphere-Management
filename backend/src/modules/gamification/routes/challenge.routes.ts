import { Router } from 'express';
import * as challengeController from '../controllers/challenge.controller';
import { validate } from '../../../middlewares/validate';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { createChallengeSchema, updateChallengeSchema } from '../validators/challenge.validator';

const router = Router();

router.use(authenticateJWT);

router.get('/', challengeController.getAll);
router.get('/:id', challengeController.getById);

router.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(createChallengeSchema),
  challengeController.create
);

router.put(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(updateChallengeSchema),
  challengeController.update
);

router.delete('/:id', authorizeRoles('ADMIN'), challengeController.deleteItem);

export default router;
