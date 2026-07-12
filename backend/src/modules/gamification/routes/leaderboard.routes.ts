import { Router } from 'express';
import * as leaderboardController from '../controllers/leaderboard.controller';
import { authenticateJWT } from '../../../middlewares/auth';

const router = Router();

router.use(authenticateJWT);
router.get('/', leaderboardController.getLeaderboard);

export default router;
