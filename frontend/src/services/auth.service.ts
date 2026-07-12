// ============================================================
// EcoSphere — Auth Service
// API calls for authentication endpoints
// ============================================================

import api from './api';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  User,
} from '@/types';

export const authService = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: async (refreshToken: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/logout', { refreshToken });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse> => {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<User>> => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  getUsers: async (params?: Record<string, string | number>): Promise<ApiResponse<User[]>> => {
    const response = await api.get('/users', { params });
    return response.data;
  },
};
