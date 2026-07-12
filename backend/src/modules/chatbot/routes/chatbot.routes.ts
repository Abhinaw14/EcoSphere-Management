// ============================================================
// ECObot - Chatbot Routes
// ============================================================

import { Router } from 'express';
import { chatbotController } from '../controllers/chatbot.controller';
import { authenticateJWT } from '../../../middlewares/auth';

const router = Router();

// Protect chatbot routes with authentication
router.use(authenticateJWT);

// Routes
router.post('/message', chatbotController.sendMessage);

export default router;
