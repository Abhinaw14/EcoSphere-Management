import { Router } from 'express';
import * as reportController from '../controllers/report.controller';
import { authenticateJWT } from '../../../middlewares/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/analytics', reportController.getAnalytics);
router.get('/export/pdf', reportController.exportPDF);
router.get('/export/csv', reportController.exportCSV);

export default router;
