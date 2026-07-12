// ============================================================
// ECObot - Chat API Service
// ============================================================

import api from './api';

export interface ChatResponse {
  reply: string;
}

export const chatService = {
  sendMessage: async (message: string): Promise<ChatResponse> => {
    const { data } = await api.post<{ success: boolean; data: ChatResponse }>('/chatbot/message', {
      message,
    });
    return data.data;
  },
};
