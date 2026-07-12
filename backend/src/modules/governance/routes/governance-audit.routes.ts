import { Router } from 'express';
import * as governanceAuditController from '../controllers/governance-audit.controller';
import { validate } from '../../../middlewares/validate';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { createGovernanceAuditSchema, updateGovernanceAuditSchema } from '../validators/governance-audit.validator';

const router = Router();

router.use(authenticateJWT);

router.get('/', governanceAuditController.getAll);
router.get('/:id', governanceAuditController.getById);

router.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(createGovernanceAuditSchema),
  governanceAuditController.create
);

router.put(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(updateGovernanceAuditSchema),
  governanceAuditController.update
);

router.delete('/:id', authorizeRoles('ADMIN'), governanceAuditController.deleteItem);

export default router;
