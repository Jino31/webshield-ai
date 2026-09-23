import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const adminService = {
  // Session & Authentication
  async unlockAdmin(password) {
    const res = await axios.post(`${API_BASE_URL}/api/admin/unlock`, { password });
    if (res.data.token) {
      sessionStorage.setItem('ws_admin_token', res.data.token);
      sessionStorage.setItem('ws_admin_unlocked_at', Date.now().toString());
    }
    return res.data;
  },

  isSessionActive() {
    const token = sessionStorage.getItem('ws_admin_token');
    const unlockedAt = parseInt(sessionStorage.getItem('ws_admin_unlocked_at') || '0', 10);
    // 8-hour session validity
    if (token && Date.now() - unlockedAt < 8 * 60 * 60 * 1000) {
      return true;
    }
    this.lockSession();
    return false;
  },

  lockSession() {
    sessionStorage.removeItem('ws_admin_token');
    sessionStorage.removeItem('ws_admin_unlocked_at');
  },

  // Telemetry & Stats
  async getAdminStats() {
    const res = await axios.get(`${API_BASE_URL}/api/admin/stats?_t=${Date.now()}`);
    return res.data;
  },

  // Users Management (Full CRUD)
  async getUsers(params = {}) {
    const query = new URLSearchParams({ _t: Date.now(), ...params }).toString();
    const res = await axios.get(`${API_BASE_URL}/api/admin/users?${query}`);
    return res.data.users || [];
  },

  async createUser(userData) {
    const res = await axios.post(`${API_BASE_URL}/api/admin/users`, userData);
    return res.data;
  },

  async updateUserRole(id, role) {
    const res = await axios.patch(`${API_BASE_URL}/api/admin/users/${id}/role`, { role });
    return res.data;
  },

  async updateUserStatus(id, status) {
    const res = await axios.patch(`${API_BASE_URL}/api/admin/users/${id}/status`, { status });
    return res.data;
  },

  async deleteUser(id) {
    const res = await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`);
    return res.data;
  },

  // Scam Reports Moderation Hub (Full Management)
  async getScamReports(params = {}) {
    const query = new URLSearchParams({ _t: Date.now(), ...params }).toString();
    const res = await axios.get(`${API_BASE_URL}/api/admin/scam-reports?${query}`);
    return res.data.reports || [];
  },

  async verifyScamReport(id, verified) {
    const res = await axios.patch(`${API_BASE_URL}/api/admin/scam-reports/${id}/verify`, { verified });
    return res.data;
  },

  async updateScamReportSeverity(id, severity) {
    const res = await axios.patch(`${API_BASE_URL}/api/admin/scam-reports/${id}/severity`, { severity });
    return res.data;
  },

  async deleteScamReport(id) {
    const res = await axios.delete(`${API_BASE_URL}/api/admin/scam-reports/${id}`);
    return res.data;
  },

  // Scan Logs & Live Audit
  async getScans(params = {}) {
    const query = new URLSearchParams({ _t: Date.now(), ...params }).toString();
    const res = await axios.get(`${API_BASE_URL}/api/admin/scans?${query}`);
    return res.data.scans || [];
  },

  async deleteScan(id) {
    const res = await axios.delete(`${API_BASE_URL}/api/admin/scans/${id}`);
    return res.data;
  },

  async clearScans() {
    const res = await axios.delete(`${API_BASE_URL}/api/admin/scans`);
    return res.data;
  },

  async triggerQuickScan(url) {
    const res = await axios.post(`${API_BASE_URL}/api/scan`, { url });
    return res.data;
  },

  // System Health
  async getSystemHealth() {
    const res = await axios.get(`${API_BASE_URL}/api/admin/health?_t=${Date.now()}`);
    return res.data;
  },

  // Comments / Feedback
  async getComments() {
    const res = await axios.get(`${API_BASE_URL}/api/admin/comments?_t=${Date.now()}`);
    return res.data.comments || [];
  },

  async markCommentReviewed(id) {
    const res = await axios.patch(`${API_BASE_URL}/api/admin/comments/${id}/review`, {});
    return res.data;
  },

  async deleteComment(id) {
    const res = await axios.delete(`${API_BASE_URL}/api/admin/comments/${id}`);
    return res.data;
  },

  // Announcements Engine
  async getAnnouncements() {
    const res = await axios.get(`${API_BASE_URL}/api/admin/announcements?_t=${Date.now()}`);
    return res.data.announcements || [];
  },

  async createAnnouncement(data) {
    const res = await axios.post(`${API_BASE_URL}/api/admin/announcements`, data);
    return res.data;
  },

  async deleteAnnouncement(id) {
    const res = await axios.delete(`${API_BASE_URL}/api/admin/announcements/${id}`);
    return res.data;
  },

  // Ad Configuration
  async getAdConfig() {
    const res = await axios.get(`${API_BASE_URL}/api/admin/ad-config?_t=${Date.now()}`);
    return res.data.config;
  },

  async updateAdConfig(data) {
    const res = await axios.put(`${API_BASE_URL}/api/admin/ad-config`, data);
    return res.data;
  },

  // Data Export Utilities (CSV / JSON)
  exportToCSV(filename, rows) {
    if (!rows || !rows.length) return;
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          if (typeof cell === 'object') cell = JSON.stringify(cell);
          cell = String(cell).replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
          return cell;
        }).join(separator);
      }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportToJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};