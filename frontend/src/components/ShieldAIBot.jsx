// ShieldSense Real-Time AI Assistant Service Layer

export const aiAssistantService = {
  async sendMessage(message, scanContext = null) {
    // Client-side security guardrail against sensitive credential leaks
    const lowerMsg = message.toLowerCase();
    const sensitiveTriggers = ['password', 'admin', 'firebase', 'secret', 'key', 'token', 'database', 'credential'];
    if (sensitiveTriggers.some(trigger => lowerMsg.includes(trigger))) {
      return "I cannot provide private security credentials, database records, or secret configuration details. I can explain our system architecture or platform features at a high level.";
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_URL}/assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, scanContext })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      return data.reply || "I received an empty response from the security engine.";
    } catch (err) {
      console.error("ShieldSense API Connection Error:", err.message);
      return "I couldn't reach the real-time AI backend. Please ensure your Express server is running on port 5000 and your GEMINI_API_KEY is configured in backend/.env.";
    }
  }
};