// backend/services/riskScore.js
// Combines your FastAPI ML prediction, threat-feed results, domain signals, and
// verified scam reports into one explainable risk score (0-100).

function computeRiskScore({ mlResult, threatFeeds, domainInfo, verifiedReportCount = 0 }) {
  const factors = [];
  let score = 0;

  // Your trained Random Forest model's own prediction (lexical URL features)
  if (mlResult?.status && /phishing|fake/i.test(mlResult.status)) {
    const mlContribution = Math.round((mlResult.confidence_score || 50) * 0.4);
    score += mlContribution;
    factors.push(`ML model flagged as ${mlResult.status} (${mlResult.confidence_score}% confidence)`);
  }

  if (threatFeeds?.flagged) {
    score += 50;
    factors.push('Listed on Google Safe Browsing / VirusTotal as malicious');
  }

  if (domainInfo?.ageDays !== null && domainInfo?.ageDays !== undefined) {
    if (domainInfo.ageDays < 30) {
      score += 20;
      factors.push(`Domain registered only ${domainInfo.ageDays} day(s) ago`);
    } else if (domainInfo.ageDays < 180) {
      score += 8;
      factors.push(`Domain is relatively new (${domainInfo.ageDays} days old)`);
    }
  }

  if (domainInfo?.hasValidSSL === false) {
    score += 15;
    factors.push('No valid SSL certificate');
  }

  if (domainInfo?.typosquat?.suspicious) {
    score += 20;
    factors.push(
      `Domain closely resembles "${domainInfo.typosquat.brand}" (edit distance ${domainInfo.typosquat.distance}) — possible typosquat`
    );
  }

  if (verifiedReportCount > 0) {
    const reportScore = Math.min(30, verifiedReportCount * 3);
    score += reportScore;
    factors.push(`${verifiedReportCount} verified user report(s) of scam/fraud`);
  }

  score = Math.min(100, score);

  if (factors.length === 0) {
    factors.push('No risk signals detected across ML model, threat feeds, domain checks, or user reports');
  }

  return {
    score,
    level: score >= 70 ? 'high' : score >= 35 ? 'medium' : 'low',
    factors
  };
}

module.exports = { computeRiskScore };
