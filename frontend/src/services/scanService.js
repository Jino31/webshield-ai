import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const scanService = {
  async scanUrl(url) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/scan`, { url });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to scan URL.';
      throw new Error(errorMsg);
    }
  }
};
