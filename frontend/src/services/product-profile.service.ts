import api from './api';
import { ProductProfile } from '../types';

export const productProfileService = {
  getAll: async () => {
    const { data } = await api.get<{ data: ProductProfile[] }>('/product-profiles');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ data: ProductProfile }>(`/product-profiles/${id}`);
    return data.data;
  },

  create: async (payload: Partial<ProductProfile>) => {
    const { data } = await api.post<{ data: ProductProfile }>('/product-profiles', payload);
    return data.data;
  },

  update: async ({ id, ...payload }: Partial<ProductProfile> & { id: string }) => {
    const { data } = await api.put<{ data: ProductProfile }>(`/product-profiles/${id}`, payload);
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/product-profiles/${id}`);
  },
};
