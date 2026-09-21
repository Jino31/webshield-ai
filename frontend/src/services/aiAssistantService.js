// ShieldSense AI Assistant Service Layer

export const aiAssistantService = {
  async sendMessage(message, scanContext = null) {
    // 1. Guardrail against credential or secret exfiltration queries
    const lowerMsg = message.toLowerCase();
    const sensitiveTriggers = ['password', 'admin', 'firebase', 'secret', 'key', 'token', 'database', 'credential', 'api key'];
    if (sensitiveTriggers.some(trigger => lowerMsg.includes(trigger))) {
      return "I cannot provide private security credentials, database records, or secret configuration details. I can explain our system architecture and scanning methodology at a high level.";
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
        throw new Error('Backend assistant service unavailable');
      }

      const data = await response.json();
      return data.reply || data.message;
    } catch (err) {
      // Intelligent fallback when backend API is unconfigured
      return this.getLocalFallbackResponse(message, scanContext);
    }
  },

  getLocalFallbackResponse(message, scanContext) {
    const q = message.toLowerCase();

    // Context-aware responses if scan results are present
    if (scanContext && (q.includes('explain') || q.includes('flagged') || q.includes('result') || q.includes('score'))) {
      return `Based on our Random Forest classification model, the URL "${scanContext.url}" was evaluated with a risk status of "${scanContext.riskLevel || scanContext.classification || 'Analyzed'}". 
      
• Confidence Score: ${scanContext.confidence || 'Evaluated'}%
• Assessment Summary: ${scanContext.description || scanContext.riskLevel || 'Checked against lexical threat patterns.'}

Remember that AI guidance is informational. Always exercise caution with unfamiliar links.`;
    }

    if (q.includes('click') || q.includes('phishing') || q.includes('entered')) {
      return `If you interacted with a suspicious or phishing link:
1. Immediately stop interacting with the website and close the tab.
2. Do not enter any additional personal information or credentials.
3. If you entered a password, change it immediately from a legitimate device on the official website.
4. Enable Multi-Factor Authentication (MFA) on your accounts and notify your financial institution if financial data was exposed.`;
    }

    if (q.includes('work') || q.includes('detect') || q.includes('scan') || q.includes('webshield')) {
      return `WebShield AI analyzes URLs using lexical feature extraction (checking domain length, special characters, and direct IP usage) evaluated through trained Random Forest machine learning models to classify threat probabilities in real-time.`;
    }

    if (q.includes('suspicious') || q.includes('url') || q.includes('spoof')) {
      return `A suspicious URL often exhibits characteristics like look-alike domains (typosquatting), excessive subdomains, hidden IP addresses, or urgent login keywords designed to harvest credentials.`;
    }

    return `I am ShieldSense, your AI security assistant. I can help analyze your recent scans or answer questions about web threat detection. Try asking "Explain my scan result" or "How does WebShield detect phishing?"`;
  }
};