import api from './api';
import { GovernanceAudit } from '../types';

export const governanceService = {
  getAll: async () => {
    const { data } = await api.get<{ success: boolean; data: GovernanceAudit[] }>('/governance');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ success: boolean; data: GovernanceAudit }>(`/governance/${id}`);
    return data.data;
  },

  create: async (auditData: Partial<GovernanceAudit>) => {
    const { data } = await api.post<{ success: boolean; data: GovernanceAudit }>('/governance', auditData);
    return data.data;
  },

  update: async (id: string, auditData: Partial<GovernanceAudit>) => {
    const { data } = await api.put<{ success: boolean; data: GovernanceAudit }>(`/governance/${id}`, auditData);
    return data.data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<{ success: boolean }>(`/governance/${id}`);
    return data.success;
  },
};
