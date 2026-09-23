import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const adminService = {
  async unlockAdmin(password) {
    const res = await axios.post(`${API_BASE_URL}/api/admin/unlock`, { password });
    return res.data;
  },
  async getAdminStats() {
    const res = await axios.get(`${API_BASE_URL}/api/admin/stats?_t=${Date.now()}`);
    return res.data;
  },
  async getUsers() {
    const res = await axios.get(`${API_BASE_URL}/api/admin/users?_t=${Date.now()}`);
    return res.data.users;
  },
  async getSystemHealth() {
    const res = await axios.get(`${API_BASE_URL}/api/admin/health?_t=${Date.now()}`);
    return res.data.health;
  },
  async getComments() {
    const res = await axios.get(`${API_BASE_URL}/api/admin/comments?_t=${Date.now()}`);
    return res.data.comments;
  },
  async markCommentReviewed(id) {
    const res = await axios.patch(`${API_BASE_URL}/api/admin/comments/${id}/review`, {});
    return res.data;
  },
  async createAnnouncement(data) {
    const res = await axios.post(`${API_BASE_URL}/api/admin/announcements`, data);
    return res.data;
  },
  async getAdConfig() {
    const res = await axios.get(`${API_BASE_URL}/api/admin/ad-config?_t=${Date.now()}`);
    return res.data.config;
  },
  async updateAdConfig(data) {
    const res = await axios.put(`${API_BASE_URL}/api/admin/ad-config`, data);
    return res.data;
  }
};