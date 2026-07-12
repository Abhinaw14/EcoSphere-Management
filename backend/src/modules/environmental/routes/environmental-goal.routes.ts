import { Router } from 'express';
import * as environmentalGoalController from '../controllers/environmental-goal.controller';
import { validate } from '../../../middlewares/validate';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { createEnvironmentalGoalSchema, updateEnvironmentalGoalSchema } from '../validators/environmental-goal.validator';

const router = Router();

router.use(authenticateJWT);

router.get('/', environmentalGoalController.getAll);
router.get('/:id', environmentalGoalController.getById);

router.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(createEnvironmentalGoalSchema),
  environmentalGoalController.create
);

router.put(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(updateEnvironmentalGoalSchema),
  environmentalGoalController.update
);

router.delete('/:id', authorizeRoles('ADMIN'), environmentalGoalController.deleteItem);

export default router;
