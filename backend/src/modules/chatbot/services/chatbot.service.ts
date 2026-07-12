// ============================================================
// ECObot - Chatbot Service (Rule-Based)
// ============================================================

export class ChatbotService {
  /**
   * Process an incoming message and return a predefined response
   */
  async processMessage(message: string): Promise<string> {
    const lowerMessage = message.toLowerCase();

    // Greeting
    if (lowerMessage.match(/\b(hi|hello|hey|greetings)\b/)) {
      return "Hello! I'm ECObot, your sustainability assistant. How can I help you today?";
    }

    // Help / Navigation
    if (lowerMessage.match(/\b(help|what can you do|navigate)\b/)) {
      return "I can help you with sustainability tips, explain how to earn points, or navigate the platform. Try asking 'How do I earn points?' or 'Give me an eco-tip'.";
    }

    // Points / Gamification
    if (lowerMessage.match(/\b(points|xp|badges|level up|rewards)\b/)) {
      return "You can earn XP by participating in Social Initiatives, completing Environmental Goals, or joining Challenges! Check the 'Challenges' or 'Rewards' tabs to see active opportunities.";
    }

    // Recycling / Waste
    if (lowerMessage.match(/\b(recycle|waste|trash|plastic)\b/)) {
      return "Remember the 3 R's: Reduce, Reuse, Recycle! Make sure to rinse plastic containers before recycling them. Check your local guidelines for specifics on what types of plastic are accepted.";
    }
    
    // Energy
    if (lowerMessage.match(/\b(energy|electricity|power|lights)\b/)) {
      return "Turning off lights when leaving a room and unplugging devices when not in use are simple ways to save energy. Consider switching to LED bulbs if you haven't already!";
    }

    // Default Response
    return "I'm still learning! Could you try rephrasing that, or ask me about 'points', 'recycling', or 'energy'?";
  }
}

export const chatbotService = new ChatbotService();
