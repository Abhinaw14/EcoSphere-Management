import api from './api';
import { SocialInitiative } from '../types';

export const socialInitiativeService = {
  getAll: async () => {
    const { data } = await api.get<{ data: SocialInitiative[] }>('/social-initiatives');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ data: SocialInitiative }>(`/social-initiatives/${id}`);
    return data.data;
  },

  create: async (payload: Partial<SocialInitiative>) => {
    const { data } = await api.post<{ data: SocialInitiative }>('/social-initiatives', payload);
    return data.data;
  },

  update: async ({ id, ...payload }: Partial<SocialInitiative> & { id: string }) => {
    const { data } = await api.put<{ data: SocialInitiative }>(`/social-initiatives/${id}`, payload);
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/social-initiatives/${id}`);
  },
};
