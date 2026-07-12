// ============================================================
// EcoSphere — Category Routes
// ============================================================

import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { validate } from '../../../middlewares/validate';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';

const router = Router();

// Apply auth middleware to all routes
router.use(authenticateJWT);

// GET /api/v1/categories
router.get('/', categoryController.getAllCategories);

// GET /api/v1/categories/:id
router.get('/:id', categoryController.getCategoryById);

// POST /api/v1/categories
router.post(
  '/',
  authorizeRoles('ADMIN'),
  validate(createCategorySchema),
  categoryController.createCategory
);

// PUT /api/v1/categories/:id
router.put(
  '/:id',
  authorizeRoles('ADMIN'),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

// DELETE /api/v1/categories/:id
router.delete('/:id', authorizeRoles('ADMIN'), categoryController.deleteCategory);

export default router;
