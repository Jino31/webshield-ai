// src/services/aiAssistantService.js

export const aiAssistantService = {
  async sendMessage(userMessage, scanContext = null) {
    // In production, send this to your backend API endpoint which interfaces with an LLM (e.g., OpenAI, Gemini API, or Hugging Face)
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, context: scanContext })
      });

      if (!response.ok) throw new Error('Failed to fetch AI response');
      const data = await response.json();
      return data.reply;
    } catch (err) {
      // Intelligent fallback responses for frontend demo/development
      const lower = userMessage.toLowerCase();
      if (lower.includes('phishing') || lower.includes('scam')) {
        return "Phishing is a fraudulent attempt to steal sensitive data like login credentials or financial information by disguising as a trustworthy entity. Always check the domain carefully!";
      } else if (lower.includes('safe') || lower.includes('scan')) {
        return "You can paste any URL into the WebShield AI scanner on the homepage to instantly evaluate its lexical patterns and threat risk level.";
      } else {
        return "I am WebShield AI's Security Assistant. I can help you analyze links, understand threat reports, and learn best practices for online safety!";
      }
    }
  }
};