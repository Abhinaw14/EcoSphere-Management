import { Router } from 'express';
import * as reportController from '../controllers/report.controller';
import { authenticateJWT } from '../../../middlewares/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/analytics', reportController.getAnalytics);

export default router;
