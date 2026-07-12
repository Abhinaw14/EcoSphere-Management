import api from './api';
import { Notification } from '../types';

export const notificationService = {
  getMyNotifications: async () => {
    const { data } = await api.get<{ data: Notification[] }>('/notifications');
    return data.data;
  },

  getUnreadCount: async () => {
    const { data } = await api.get<{ data: { count: number } }>('/notifications/unread-count');
    return data.data.count;
  },

  markAsRead: async (id: string) => {
    await api.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    await api.put('/notifications/read-all');
  },

  deleteItem: async (id: string) => {
    await api.delete(`/notifications/${id}`);
  },
};
