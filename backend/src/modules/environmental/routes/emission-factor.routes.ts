import { Router } from 'express';
import * as emissionFactorController from '../controllers/emission-factor.controller';
import { validate } from '../../../middlewares/validate';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { createEmissionFactorSchema, updateEmissionFactorSchema } from '../validators/emission-factor.validator';

const router = Router();

router.use(authenticateJWT);

router.get('/', emissionFactorController.getAll);
router.get('/:id', emissionFactorController.getById);

router.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(createEmissionFactorSchema),
  emissionFactorController.create
);

router.put(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(updateEmissionFactorSchema),
  emissionFactorController.update
);

router.delete('/:id', authorizeRoles('ADMIN'), emissionFactorController.deleteItem);

export default router;
