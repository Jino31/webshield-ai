// Admin Service Layer for WebShield AI Security Console

export const adminService = {
  async getAdminStats() {
    // Simulated backend telemetry fetch
    return {
      totalUsers: 1284,
      totalScans: 8462,
      safeUrls: 7312,
      suspiciousUrls: 742,
      phishingDetected: 408,
      detectionRate: '98.4%',
      scansToday: 320,
      activeUsers: 142
    };
  },

  async getUsers() {
    return [
      { id: 'usr_01', name: 'S. Jeffrin Jino', email: 'jino@webshield.ai', role: 'Administrator', status: 'Active', scansCount: 142, lastActive: '2 mins ago', joined: '12 May 2026' },
      { id: 'usr_02', name: 'Sarah Connor', email: 'sarah@secops.io', role: 'Analyst', status: 'Active', scansCount: 89, lastActive: '1 hour ago', joined: '18 Jun 2026' },
      { id: 'usr_03', name: 'Marcus Vance', email: 'marcus@cyberpulse.net', role: 'Standard', status: 'Inactive', scansCount: 12, lastActive: '3 days ago', joined: '01 Jul 2026' },
      { id: 'usr_04', name: 'Elena Rostova', email: 'elena@threatintel.org', role: 'Analyst', status: 'Active', scansCount: 230, lastActive: 'Just now', joined: '22 Aug 2026' },
    ];
  },

  async getRecentScans() {
    return [
      { id: 'scn_101', url: 'https://example.com', user: 'jino@webshield.ai', result: 'Safe', risk: 'Low', confidence: '99.1%', time: '2 mins ago', status: 'Verified' },
      { id: 'scn_102', url: 'http://192.168.1.50/login-verify', user: 'sarah@secops.io', result: 'Phishing', risk: 'Critical', confidence: '96.8%', time: '14 mins ago', status: 'Blocked' },
      { id: 'scn_103', url: 'https://secure-login-apple-support.xyz', user: 'elena@threatintel.org', result: 'Phishing', risk: 'High', confidence: '94.2%', time: '45 mins ago', status: 'Blocked' },
      { id: 'scn_104', url: 'https://github.com', user: 'marcus@cyberpulse.net', result: 'Safe', risk: 'Low', confidence: '99.9%', time: '2 hours ago', status: 'Verified' },
    ];
  },

  async getThreats() {
    return [
      { id: 'thr_01', domain: 'secure-login-apple-support.xyz', type: 'Credential Harvesting', risk: 'Critical', source: 'ML Heuristic Engine', confidence: '96.4%', firstDetected: '10 Sep 2026', status: 'Active Block' },
      { id: 'thr_02', domain: 'paypal-security-update-portal.com', type: 'Fake Banking Portal', risk: 'High', source: 'Threat Feed API', confidence: '92.1%', firstDetected: '14 Sep 2026', status: 'Active Block' },
      { id: 'thr_03', domain: 'crypto-drainer-claim.net', type: 'Crypto Drainer', risk: 'Critical', source: 'Lexical Analysis', confidence: '98.5%', firstDetected: '17 Sep 2026', status: 'Contained' },
    ];
  },

  async getActivityLogs() {
    return [
      { id: 'log_01', timestamp: '18 Sep 2026, 10:30 PM', actor: 'S. Jeffrin Jino', action: 'Admin Login', resource: '/admin', status: 'Success' },
      { id: 'log_02', timestamp: '18 Sep 2026, 09:15 PM', actor: 'Sarah Connor', action: 'Threat Rule Updated', resource: 'ML Engine v4.2', status: 'Success' },
      { id: 'log_03', timestamp: '18 Sep 2026, 08:00 PM', actor: 'System Daemon', action: 'Database Backup', resource: 'Firestore Cluster', status: 'Completed' },
      { id: 'log_04', timestamp: '18 Sep 2026, 05:42 PM', actor: 'Elena Rostova', action: 'User Role Modified', resource: 'usr_03', status: 'Success' },
    ];
  },

  async getSystemHealth() {
    return [
      { service: 'API Gateway / Backend', status: 'Operational', latency: '42ms', uptime: '99.98%' },
      { service: 'Firestore Database', status: 'Operational', latency: '18ms', uptime: '100%' },
      { service: 'Firebase Authentication', status: 'Operational', latency: '35ms', uptime: '99.99%' },
      { service: 'ML Classification Service', status: 'Operational', latency: '110ms', uptime: '99.85%' },
    ];
  }
};