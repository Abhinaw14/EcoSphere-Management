import api from './api';
import { EnvironmentalMetric } from '../types';

export const environmentalService = {
  getAll: async () => {
    const { data } = await api.get<{ success: boolean; data: EnvironmentalMetric[] }>('/environmental');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ success: boolean; data: EnvironmentalMetric }>(`/environmental/${id}`);
    return data.data;
  },

  create: async (metricData: Partial<EnvironmentalMetric>) => {
    const { data } = await api.post<{ success: boolean; data: EnvironmentalMetric }>('/environmental', metricData);
    return data.data;
  },

  update: async (id: string, metricData: Partial<EnvironmentalMetric>) => {
    const { data } = await api.put<{ success: boolean; data: EnvironmentalMetric }>(`/environmental/${id}`, metricData);
    return data.data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<{ success: boolean }>(`/environmental/${id}`);
    return data.success;
  },
};
