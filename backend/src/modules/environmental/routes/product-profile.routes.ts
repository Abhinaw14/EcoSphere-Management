import { Router } from 'express';
import * as productProfileController from '../controllers/product-profile.controller';
import { validate } from '../../../middlewares/validate';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { createProductProfileSchema, updateProductProfileSchema } from '../validators/product-profile.validator';

const router = Router();

router.use(authenticateJWT);

router.get('/', productProfileController.getAll);
router.get('/:id', productProfileController.getById);

router.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(createProductProfileSchema),
  productProfileController.create
);

router.put(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(updateProductProfileSchema),
  productProfileController.update
);

router.delete('/:id', authorizeRoles('ADMIN'), productProfileController.deleteItem);

export default router;
