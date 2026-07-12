import { Router } from 'express';
import * as socialParticipationController from '../controllers/social-participation.controller';
import { validate } from '../../../middlewares/validate';
import { authenticateJWT, authorizeRoles } from '../../../middlewares/auth';
import { createSocialParticipationSchema, updateSocialParticipationSchema } from '../validators/social-participation.validator';

const router = Router();

router.use(authenticateJWT);

router.get('/', socialParticipationController.getAll);
router.get('/me', socialParticipationController.getMyParticipations);
router.get('/:id', socialParticipationController.getById);

router.post(
  '/',
  validate(createSocialParticipationSchema),
  socialParticipationController.create
);

router.put(
  '/:id',
  validate(updateSocialParticipationSchema),
  socialParticipationController.update
);

router.delete('/:id', authorizeRoles('ADMIN', 'MANAGER'), socialParticipationController.deleteItem);

export default router;
