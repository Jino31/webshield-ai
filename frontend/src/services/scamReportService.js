import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const scamReportService = {
  async submitReport({ url, category, description, proofUrl }) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/report-scam`, {
        url,
        category,
        description,
        proofUrl
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to submit report.';
      throw new Error(errorMsg);
    }
  }
};
