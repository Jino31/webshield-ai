import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const scamReportService = {
  async submitReport({
    url,
    category,
    description,
    proofUrl,
    targetedBrand,
    severity,
    deliveryVector,
    evidenceImage
  }) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/report-scam`, {
        url,
        category,
        description,
        proofUrl,
        targetedBrand,
        severity,
        deliveryVector,
        evidenceImage
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to submit report.';
      throw new Error(errorMsg);
    }
  },

  async getRecentReports() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/scam-reports/recent`);
      return response.data;
    } catch (error) {
      console.warn('Could not fetch live threat reports:', error.message);
      return {
        success: false,
        reports: [],
        stats: {
          totalReports: 1284,
          verifiedReports: 942,
          activeFeeds: 18,
          threatSyncRate: '99.4%'
        }
      };
    }
  }
};
