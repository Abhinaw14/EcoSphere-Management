import api from './api';
import { GovernanceAudit } from '../types';

export const governanceAuditService = {
  getAll: async () => {
    const { data } = await api.get<{ data: GovernanceAudit[] }>('/governance-audits');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ data: GovernanceAudit }>(`/governance-audits/${id}`);
    return data.data;
  },

  create: async (payload: Partial<GovernanceAudit>) => {
    const { data } = await api.post<{ data: GovernanceAudit }>('/governance-audits', payload);
    return data.data;
  },

  update: async ({ id, ...payload }: Partial<GovernanceAudit> & { id: string }) => {
    const { data } = await api.put<{ data: GovernanceAudit }>(`/governance-audits/${id}`, payload);
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/governance-audits/${id}`);
  },
};
