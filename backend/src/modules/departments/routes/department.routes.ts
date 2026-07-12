// ============================================================
// EcoSphere — Department Routes
// ============================================================

import { Router } from 'express';
import * as departmentController from '../controllers/department.controller';
import { validate } from '../../../middlewares/validate';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { createDepartmentSchema, updateDepartmentSchema } from '../validators/department.validator';

const router = Router();

// Apply auth middleware to all routes
router.use(authenticateJWT);

// GET /api/v1/departments
router.get('/', departmentController.getAllDepartments);

// GET /api/v1/departments/:id
router.get('/:id', departmentController.getDepartmentById);

// POST /api/v1/departments
router.post(
  '/',
  authorizeRoles('ADMIN'),
  validate(createDepartmentSchema),
  departmentController.createDepartment
);

// PUT /api/v1/departments/:id
router.put(
  '/:id',
  authorizeRoles('ADMIN'),
  validate(updateDepartmentSchema),
  departmentController.updateDepartment
);

// DELETE /api/v1/departments/:id
router.delete('/:id', authorizeRoles('ADMIN'), departmentController.deleteDepartment);

export default router;
