import api from './api';
import { EmissionFactor } from '../types';

export const emissionFactorService = {
  getAll: async () => {
    const { data } = await api.get<{ data: EmissionFactor[] }>('/emission-factors');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ data: EmissionFactor }>(`/emission-factors/${id}`);
    return data.data;
  },

  create: async (payload: Partial<EmissionFactor>) => {
    const { data } = await api.post<{ data: EmissionFactor }>('/emission-factors', payload);
    return data.data;
  },

  update: async ({ id, ...payload }: Partial<EmissionFactor> & { id: string }) => {
    const { data } = await api.put<{ data: EmissionFactor }>(`/emission-factors/${id}`, payload);
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/emission-factors/${id}`);
  },
};
