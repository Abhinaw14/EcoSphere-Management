import api from './api';
import { SocialParticipation } from '../types';

export const socialParticipationService = {
  getAll: async () => {
    const { data } = await api.get<{ data: SocialParticipation[] }>('/social-participations');
    return data.data;
  },

  getMyParticipations: async () => {
    const { data } = await api.get<{ data: SocialParticipation[] }>('/social-participations/me');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ data: SocialParticipation }>(`/social-participations/${id}`);
    return data.data;
  },

  create: async (payload: Partial<SocialParticipation>) => {
    const { data } = await api.post<{ data: SocialParticipation }>('/social-participations', payload);
    return data.data;
  },

  update: async ({ id, ...payload }: Partial<SocialParticipation> & { id: string }) => {
    const { data } = await api.put<{ data: SocialParticipation }>(`/social-participations/${id}`, payload);
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/social-participations/${id}`);
  },
};
