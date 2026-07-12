import api from './api';
import { User } from '../types';

export const userService = {
  getAll: async () => {
    const { data } = await api.get<{ data: User[] }>('/users');
    return data.data;
  },
};
