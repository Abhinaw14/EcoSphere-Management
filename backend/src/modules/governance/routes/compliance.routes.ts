import { Router } from 'express';
import * as complianceController from '../controllers/compliance.controller';
import { validate } from '../../../middlewares/validate';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { createComplianceSchema, updateComplianceSchema } from '../validators/compliance.validator';

const router = Router();

router.use(authenticateJWT);

router.get('/', complianceController.getAll);
router.get('/:id', complianceController.getById);

router.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(createComplianceSchema),
  complianceController.create
);

router.put(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(updateComplianceSchema),
  complianceController.update
);

router.delete('/:id', authorizeRoles('ADMIN'), complianceController.deleteItem);

export default router;
