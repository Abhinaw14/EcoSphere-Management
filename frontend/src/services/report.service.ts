import api from './api';

export interface AnalyticsData {
  environmental: {
    totalEmissions: number;
    totalOffsets: number;
    totalCredits: number;
    netCarbon: number;
  };
  social: {
    totalVolunteerHours: number;
    activeInitiativesCount: number;
  };
  governance: {
    complianceRate: number;
    pendingAuditsCount: number;
  };
  engagement: {
    topUsers: Array<{
      id: string;
      firstName: string;
      lastName: string;
      xpPoints: number;
      avatarUrl?: string;
    }>;
  };
}

export const reportService = {
  getAnalytics: async () => {
    const { data } = await api.get<{ data: AnalyticsData }>('/reports/analytics');
    return data.data;
  },
};
