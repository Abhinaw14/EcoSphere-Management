import api from './api';
import { EnvironmentalGoal } from '../types';

export const environmentalGoalService = {
  getAll: async () => {
    const { data } = await api.get<{ data: EnvironmentalGoal[] }>('/environmental-goals');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ data: EnvironmentalGoal }>(`/environmental-goals/${id}`);
    return data.data;
  },

  create: async (payload: Partial<EnvironmentalGoal>) => {
    const { data } = await api.post<{ data: EnvironmentalGoal }>('/environmental-goals', payload);
    return data.data;
  },

  update: async ({ id, ...payload }: Partial<EnvironmentalGoal> & { id: string }) => {
    const { data } = await api.put<{ data: EnvironmentalGoal }>(`/environmental-goals/${id}`, payload);
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/environmental-goals/${id}`);
  },
};
