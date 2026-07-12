import { Router } from 'express';
import * as carbonTransactionController from '../controllers/carbon-transaction.controller';
import { validate } from '../../../middlewares/validate';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { createCarbonTransactionSchema, updateCarbonTransactionSchema } from '../validators/carbon-transaction.validator';

const router = Router();

router.use(authenticateJWT);

router.get('/', carbonTransactionController.getAll);
router.get('/:id', carbonTransactionController.getById);

router.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(createCarbonTransactionSchema),
  carbonTransactionController.create
);

router.put(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(updateCarbonTransactionSchema),
  carbonTransactionController.update
);

router.delete('/:id', authorizeRoles('ADMIN'), carbonTransactionController.deleteItem);

export default router;
