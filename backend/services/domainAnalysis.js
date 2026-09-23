// backend/services/domainAnalysis.js
// Objective domain-level signals your ML model's lexical features don't cover:
// domain age, SSL cert validity, typosquat distance to known brand domains.
// npm i whois-json  (add to backend/package.json — see below)

const tls = require('tls');
const whois = require('whois-json');

const KNOWN_BRAND_DOMAINS = [
  'paypal.com', 'google.com', 'amazon.com', 'amazon.in', 'flipkart.com',
  'hdfcbank.com', 'icicibank.com', 'sbi.co.in', 'microsoft.com', 'apple.com',
  'netflix.com', 'facebook.com', 'instagram.com'
  // extend with brands relevant to your user base
];

function extractDomain(rawUrl) {
  const withScheme = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  return new URL(withScheme).hostname.replace(/^www\./, '').toLowerCase();
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

function closestBrandMatch(domain) {
  let best = { brand: null, distance: Infinity };
  for (const brand of KNOWN_BRAND_DOMAINS) {
    const d = levenshtein(domain, brand);
    if (d < best.distance) best = { brand, distance: d };
  }
  // distance 1-3 on a domain that ISN'T the real brand = classic typosquat
  return { ...best, suspicious: best.distance > 0 && best.distance <= 3 };
}

async function getDomainAgeDays(domain) {
  try {
    const data = await whois(domain);
    const created = data.creationDate || data.createdDate;
    if (!created) return { ageDays: null, error: 'not_found' };
    const ageDays = Math.floor((Date.now() - new Date(created).getTime()) / 86400000);
    return { ageDays };
  } catch (e) {
    return { ageDays: null, error: e.message };
  }
}

function checkSSL(domain) {
  return new Promise((resolve) => {
    const socket = tls.connect(443, domain, { servername: domain, timeout: 5000 }, () => {
      const cert = socket.getPeerCertificate();
      const valid = socket.authorized;
      socket.end();
      resolve({
        hasValidSSL: valid,
        issuer: cert?.issuer?.O || null,
        validTo: cert?.valid_to || null
      });
    });
    socket.on('error', () => resolve({ hasValidSSL: false, error: 'connection_failed' }));
    socket.on('timeout', () => {
      socket.destroy();
      resolve({ hasValidSSL: false, error: 'timeout' });
    });
  });
}

async function analyzeDomain(rawUrl) {
  const domain = extractDomain(rawUrl);
  const [age, ssl] = await Promise.all([getDomainAgeDays(domain), checkSSL(domain)]);
  const typosquat = closestBrandMatch(domain);
  return { domain, ...age, ...ssl, typosquat };
}

module.exports = { analyzeDomain, extractDomain, closestBrandMatch, levenshtein };
