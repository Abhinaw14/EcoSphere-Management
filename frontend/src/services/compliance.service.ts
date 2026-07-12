import api from './api';
import { ComplianceRecord } from '../types';

export const complianceService = {
  getAll: async () => {
    const { data } = await api.get<{ data: ComplianceRecord[] }>('/compliances');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ data: ComplianceRecord }>(`/compliances/${id}`);
    return data.data;
  },

  create: async (payload: Partial<ComplianceRecord>) => {
    const { data } = await api.post<{ data: ComplianceRecord }>('/compliances', payload);
    return data.data;
  },

  update: async ({ id, ...payload }: Partial<ComplianceRecord> & { id: string }) => {
    const { data } = await api.put<{ data: ComplianceRecord }>(`/compliances/${id}`, payload);
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/compliances/${id}`);
  },
};
