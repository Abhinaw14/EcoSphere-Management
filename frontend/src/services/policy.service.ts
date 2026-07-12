import api from './api';
import { Policy } from '../types';

export const policyService = {
  getAll: async () => {
    const { data } = await api.get<{ data: Policy[] }>('/policies');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ data: Policy }>(`/policies/${id}`);
    return data.data;
  },

  create: async (payload: Partial<Policy>) => {
    const { data } = await api.post<{ data: Policy }>('/policies', payload);
    return data.data;
  },

  update: async ({ id, ...payload }: Partial<Policy> & { id: string }) => {
    const { data } = await api.put<{ data: Policy }>(`/policies/${id}`, payload);
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/policies/${id}`);
  },
};
