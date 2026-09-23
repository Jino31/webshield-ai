// backend/services/threatFeeds.js
// Cross-checks a URL against established threat-intel feeds (Google Safe Browsing, VirusTotal).
// Requires env vars: GOOGLE_SAFE_BROWSING_KEY, VIRUSTOTAL_API_KEY (both have free tiers).
// If a key is missing, that feed is skipped rather than failing the whole check.

const axios = require('axios');

const GSB_ENDPOINT = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';
const VT_URL_ENDPOINT = 'https://www.virustotal.com/api/v3/urls';

async function checkGoogleSafeBrowsing(url) {
  const key = process.env.GOOGLE_SAFE_BROWSING_KEY;
  if (!key) return { source: 'google_safe_browsing', flagged: false, error: 'missing_api_key' };

  try {
    const body = {
      client: { clientId: 'webshield-ai', clientVersion: '1.0' },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }]
      }
    };
    const { data } = await axios.post(`${GSB_ENDPOINT}?key=${key}`, body, { timeout: 6000 });
    const matches = data.matches || [];
    return {
      source: 'google_safe_browsing',
      flagged: matches.length > 0,
      threatTypes: matches.map((m) => m.threatType)
    };
  } catch (err) {
    return { source: 'google_safe_browsing', flagged: false, error: err.message };
  }
}

async function checkVirusTotal(url) {
  const key = process.env.VIRUSTOTAL_API_KEY;
  if (!key) return { source: 'virustotal', flagged: false, error: 'missing_api_key' };

  try {
    // VT requires URL id = base64url(url) without padding
    const urlId = Buffer.from(url).toString('base64url').replace(/=+$/, '');
    const { data } = await axios.get(`${VT_URL_ENDPOINT}/${urlId}`, {
      headers: { 'x-apikey': key },
      timeout: 6000,
      validateStatus: (s) => s === 200 || s === 404
    });

    if (!data || !data.data) {
      return { source: 'virustotal', flagged: false, seen: false };
    }

    const stats = data.data.attributes?.last_analysis_stats || {};
    const malicious = (stats.malicious || 0) + (stats.suspicious || 0);

    return {
      source: 'virustotal',
      flagged: malicious > 0,
      seen: true,
      maliciousEngines: malicious,
      totalEngines: Object.values(stats).reduce((a, b) => a + b, 0)
    };
  } catch (err) {
    return { source: 'virustotal', flagged: false, error: err.message };
  }
}

async function checkThreatFeeds(url) {
  const [gsb, vt] = await Promise.all([checkGoogleSafeBrowsing(url), checkVirusTotal(url)]);
  const results = [gsb, vt];
  return { flagged: results.some((r) => r.flagged), results };
}

module.exports = { checkThreatFeeds, checkGoogleSafeBrowsing, checkVirusTotal };
