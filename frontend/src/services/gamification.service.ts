import api from './api';
import { Challenge, Badge, User } from '../types';

export const gamificationService = {
  // Challenges
  getChallenges: async () => {
    const { data } = await api.get<{ data: Challenge[] }>('/challenges');
    return data.data;
  },

  createChallenge: async (payload: Partial<Challenge>) => {
    const { data } = await api.post<{ data: Challenge }>('/challenges', payload);
    return data.data;
  },

  updateChallenge: async ({ id, ...payload }: Partial<Challenge> & { id: string }) => {
    const { data } = await api.put<{ data: Challenge }>(`/challenges/${id}`, payload);
    return data.data;
  },

  deleteChallenge: async (id: string) => {
    await api.delete(`/challenges/${id}`);
  },

  // Badges
  getBadges: async () => {
    const { data } = await api.get<{ data: Badge[] }>('/badges');
    return data.data;
  },

  createBadge: async (payload: Partial<Badge>) => {
    const { data } = await api.post<{ data: Badge }>('/badges', payload);
    return data.data;
  },

  updateBadge: async ({ id, ...payload }: Partial<Badge> & { id: string }) => {
    const { data } = await api.put<{ data: Badge }>(`/badges/${id}`, payload);
    return data.data;
  },

  deleteBadge: async (id: string) => {
    await api.delete(`/badges/${id}`);
  },

  // Leaderboard
  getLeaderboard: async (limit = 10) => {
    const { data } = await api.get<{ data: User[] }>(`/leaderboard?limit=${limit}`);
    return data.data;
  },
};
