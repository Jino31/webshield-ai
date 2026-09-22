import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const feedbackService = {
  async submitFeedback(feedbackData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/feedback`, feedbackData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        // Server responded with an error status (4xx, 5xx)
        const errorMessage = error.response.data?.error || `Server responded with status ${error.response.status}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        // Network failure or no response received
        throw new Error("We couldn't connect to the server. Please check your internet connection or try again later.");
      } else {
        // Other unexpected errors
        throw new Error("An unexpected error occurred while submitting your feedback.");
      }
    }
  }
};