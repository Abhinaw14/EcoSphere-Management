import { notificationRepository } from '../repositories/notification.repository';
import { CreateNotificationInput } from '../validators/notification.validator';

export class NotificationService {
  async getAllByUser(userId: string) {
    return notificationRepository.findAllByUser(userId);
  }

  async getUnreadCount(userId: string) {
    return notificationRepository.getUnreadCount(userId);
  }

  async create(data: CreateNotificationInput) {
    return notificationRepository.create(data);
  }

  async markAsRead(id: string) {
    return notificationRepository.markAsRead(id);
  }

  async markAllAsRead(userId: string) {
    return notificationRepository.markAllAsRead(userId);
  }

  async delete(id: string) {
    return notificationRepository.delete(id);
  }
}

export const notificationService = new NotificationService();
