import { Router } from 'express';
import * as environmentalController from '../controllers/environmental.controller';
import { validate } from '../../../middlewares/validate';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { createEnvironmentalSchema, updateEnvironmentalSchema } from '../validators/environmental.validator';

const router = Router();

// Apply auth middleware to all routes
router.use(authenticateJWT);

// GET /api/v1/environmental
router.get('/', environmentalController.getAllMetrics);

// GET /api/v1/environmental/:id
router.get('/:id', environmentalController.getMetricById);

// POST /api/v1/environmental
router.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(createEnvironmentalSchema),
  environmentalController.createMetric
);

// PUT /api/v1/environmental/:id
router.put(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(updateEnvironmentalSchema),
  environmentalController.updateMetric
);

// DELETE /api/v1/environmental/:id
router.delete('/:id', authorizeRoles('ADMIN'), environmentalController.deleteMetric);

export default router;
