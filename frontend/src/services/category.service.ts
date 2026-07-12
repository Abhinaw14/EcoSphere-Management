import api from './api';
import { Category } from '@/types';

export const categoryService = {
  getAll: async () => {
    const response = await api.get<{ data: Category[] }>('/categories');
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{ data: Category }>(`/categories/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<Category>) => {
    const response = await api.post<{ data: Category }>('/categories', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Category>) => {
    const response = await api.put<{ data: Category }>(`/categories/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
