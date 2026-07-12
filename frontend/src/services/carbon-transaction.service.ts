import api from './api';
import { CarbonTransaction } from '../types';

export const carbonTransactionService = {
  getAll: async () => {
    const { data } = await api.get<{ data: CarbonTransaction[] }>('/carbon-transactions');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ data: CarbonTransaction }>(`/carbon-transactions/${id}`);
    return data.data;
  },

  create: async (payload: Partial<CarbonTransaction>) => {
    const { data } = await api.post<{ data: CarbonTransaction }>('/carbon-transactions', payload);
    return data.data;
  },

  update: async ({ id, ...payload }: Partial<CarbonTransaction> & { id: string }) => {
    const { data } = await api.put<{ data: CarbonTransaction }>(`/carbon-transactions/${id}`, payload);
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/carbon-transactions/${id}`);
  },
};
