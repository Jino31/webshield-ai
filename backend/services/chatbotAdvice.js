// backend/services/chatbotAdvice.js
// Generates an actionable next-step message for the /api/scan response
// (ShieldAIBot can surface this directly instead of a generic reply).

function getChatbotAdvice(riskResult, domain) {
  const { level, factors } = riskResult;

  if (level === 'high') {
    return {
      message: `This looks high-risk (${domain}). ${factors[0] || ''} Do NOT enter passwords, OTPs, or card details here.`,
      actions: [
        { label: 'Report to Indian Cyber Crime Portal', url: 'https://cybercrime.gov.in' },
        { label: 'Report to Google Safe Browsing', url: 'https://safebrowsing.google.com/safebrowsing/report_phish/' },
        { label: "If you already entered bank details, contact your bank's helpline immediately", url: null }
      ]
    };
  }

  if (level === 'medium') {
    return {
      message: `${domain} shows some risk signals (${factors.join('; ')}). Proceed carefully — verify the URL spelling and check for HTTPS before entering any data.`,
      actions: [{ label: 'Report to Indian Cyber Crime Portal', url: 'https://cybercrime.gov.in' }]
    };
  }

  return {
    message: `No major risk signals found for ${domain}. Still, always double-check the URL before entering sensitive info.`,
    actions: []
  };
}

module.exports = { getChatbotAdvice };
