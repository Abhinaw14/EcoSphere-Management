import { Router } from 'express';
import * as policyController from '../controllers/policy.controller';
import { validate } from '../../../middlewares/validate';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { createPolicySchema, updatePolicySchema } from '../validators/policy.validator';

const router = Router();

router.use(authenticateJWT);

router.get('/', policyController.getAll);
router.get('/:id', policyController.getById);

router.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(createPolicySchema),
  policyController.create
);

router.put(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(updatePolicySchema),
  policyController.update
);

router.delete('/:id', authorizeRoles('ADMIN'), policyController.deleteItem);

export default router;
