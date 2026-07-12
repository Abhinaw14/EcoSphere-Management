import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller';
import { authenticateJWT } from '../../../middlewares/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', notificationController.getMyNotifications);
router.get('/unread-count', notificationController.getMyUnreadCount);
router.put('/:id/read', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteItem);

export default router;
