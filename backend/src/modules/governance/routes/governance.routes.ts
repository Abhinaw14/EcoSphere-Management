import { Router } from 'express';
import * as governanceController from '../controllers/governance.controller';
import { validate } from '../../../middlewares/validate';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { createGovernanceSchema, updateGovernanceSchema } from '../validators/governance.validator';

const router = Router();

// Apply auth middleware to all routes
router.use(authenticateJWT);

// GET /api/v1/governance
router.get('/', governanceController.getAllAudits);

// GET /api/v1/governance/:id
router.get('/:id', governanceController.getAuditById);

// POST /api/v1/governance
router.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(createGovernanceSchema),
  governanceController.createAudit
);

// PUT /api/v1/governance/:id
router.put(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(updateGovernanceSchema),
  governanceController.updateAudit
);

// DELETE /api/v1/governance/:id
router.delete('/:id', authorizeRoles('ADMIN'), governanceController.deleteAudit);

export default router;
