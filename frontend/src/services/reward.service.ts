import api from './api';
import { Reward, RewardRedemption } from '../types';

export const rewardService = {
  getAll: async () => {
    const { data } = await api.get<{ data: Reward[] }>('/rewards');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ data: Reward }>(`/rewards/${id}`);
    return data.data;
  },

  create: async (payload: Partial<Reward>) => {
    const { data } = await api.post<{ data: Reward }>('/rewards', payload);
    return data.data;
  },

  update: async ({ id, ...payload }: Partial<Reward> & { id: string }) => {
    const { data } = await api.put<{ data: Reward }>(`/rewards/${id}`, payload);
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/rewards/${id}`);
  },

  redeem: async (id: string) => {
    const { data } = await api.post<{ data: RewardRedemption }>(`/rewards/${id}/redeem`);
    return data.data;
  },
};
