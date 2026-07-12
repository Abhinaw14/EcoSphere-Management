import api from './api';
import { Department } from '@/types';

export const departmentService = {
  getAll: async () => {
    const response = await api.get<{ data: Department[] }>('/departments');
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{ data: Department }>(`/departments/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<Department>) => {
    const response = await api.post<{ data: Department }>('/departments', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Department>) => {
    const response = await api.put<{ data: Department }>(`/departments/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  },
};
