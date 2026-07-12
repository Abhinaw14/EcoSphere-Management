import { Router } from 'express';
import * as rewardController from '../controllers/reward.controller';
import { validate } from '../../../middlewares/validate';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { createRewardSchema, updateRewardSchema } from '../validators/reward.validator';

const router = Router();

router.use(authenticateJWT);

router.get('/', rewardController.getAll);
router.get('/:id', rewardController.getById);

// Reward Redemption
router.post('/:id/redeem', rewardController.redeem);

router.post(
  '/',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(createRewardSchema),
  rewardController.create
);

router.put(
  '/:id',
  authorizeRoles('ADMIN', 'MANAGER'),
  validate(updateRewardSchema),
  rewardController.update
);

router.delete('/:id', authorizeRoles('ADMIN'), rewardController.deleteItem);

export default router;
