import api from './api';
import { SocialInitiative } from '../types';

export const socialService = {
  getAll: async () => {
    const { data } = await api.get<{ success: boolean; data: SocialInitiative[] }>('/social');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ success: boolean; data: SocialInitiative }>(`/social/${id}`);
    return data.data;
  },

  create: async (initiativeData: Partial<SocialInitiative>) => {
    const { data } = await api.post<{ success: boolean; data: SocialInitiative }>('/social', initiativeData);
    return data.data;
  },

  update: async (id: string, initiativeData: Partial<SocialInitiative>) => {
    const { data } = await api.put<{ success: boolean; data: SocialInitiative }>(`/social/${id}`, initiativeData);
    return data.data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<{ success: boolean }>(`/social/${id}`);
    return data.success;
  },
};
