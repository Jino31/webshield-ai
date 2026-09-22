import axios from 'axios';
import { auth } from '../firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function getAuthHeader() {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated session found.");
  const token = await user.getIdToken();
  return { headers: { 'Authorization': `Bearer ${token}` } };
}

export const adminService = {
  async unlockAdmin(password) {
    const config = await getAuthHeader();
    const res = await axios.post(`${API_BASE_URL}/api/admin/unlock`, { password }, config);
    return res.data;
  },
  async getAdminStats() {
    const config = await getAuthHeader();
    const res = await axios.get(`${API_BASE_URL}/api/admin/stats`, config);
    return res.data;
  },
  async getUsers() {
    return [
      { id: 'usr_01', name: 'S. Jeffrin Jino', email: 'jino@webshield.ai', role: 'Administrator', status: 'Active', scansCount: 142, joined: '12 May 2026' },
      { id: 'usr_02', name: 'Sarah Connor', email: 'sarah@secops.io', role: 'Analyst', status: 'Active', scansCount: 89, joined: '18 Jun 2026' }
    ];
  },
  async getSystemHealth() {
    const config = await getAuthHeader();
    const res = await axios.get(`${API_BASE_URL}/api/admin/health`, config);
    return res.data.health;
  },
  async getComments() {
    const config = await getAuthHeader();
    const res = await axios.get(`${API_BASE_URL}/api/admin/comments`, config);
    return res.data.comments;
  },
  async markCommentReviewed(id) {
    const config = await getAuthHeader();
    const res = await axios.patch(`${API_BASE_URL}/api/admin/comments/${id}/review`, {}, config);
    return res.data;
  },
  async createAnnouncement(data) {
    const config = await getAuthHeader();
    const res = await axios.post(`${API_BASE_URL}/api/admin/announcements`, data, config);
    return res.data;
  },
  async getAdConfig() {
    const res = await axios.get(`${API_BASE_URL}/api/admin/ad-config`);
    return res.data.config;
  },
  async updateAdConfig(data) {
    const config = await getAuthHeader();
    const res = await axios.put(`${API_BASE_URL}/api/admin/ad-config`, data, config);
    return res.data;
  }
};