// ============================================================
// ECObot - Chatbot Controller
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { chatbotService } from '../services/chatbot.service';
import { sendSuccess } from '../../../utils/response';

export class ChatbotController {
  /**
   * POST /api/v1/chatbot/message
   */
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'A valid message string is required.',
        });
      }

      const responseMessage = await chatbotService.processMessage(message);

      sendSuccess(res, { reply: responseMessage }, 'Message processed successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const chatbotController = new ChatbotController();
