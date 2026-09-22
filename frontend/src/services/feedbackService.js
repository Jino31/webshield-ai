import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const feedbackService = {
  async submitFeedback(payload) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/feedback`, payload);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to submit feedback.';
      throw new Error(errorMsg);
    }
  }
};