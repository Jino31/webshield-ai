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
        const status = error.response.status;
        const serverMessage = error.response.data?.error;

        if (status === 400) {
          throw new Error(serverMessage || "Please check your feedback details and try again.");
        } else if (status === 401) {
          throw new Error("Your session has expired. Please sign in again.");
        } else if (status === 403) {
          throw new Error("You are not authorized to submit feedback.");
        } else if (status === 429) {
          throw new Error("Too many requests. Please wait a moment and try again.");
        } else if (status >= 500) {
          throw new Error("We couldn't submit your feedback right now. Please try again later.");
        }
        throw new Error(serverMessage || `Server responded with status ${status}`);
      } else if (error.request) {
        throw new Error("Unable to connect to the WebShield AI server. Please check your connection and try again.");
      } else {
        throw new Error("An unexpected error occurred while submitting your feedback.");
      }
    }
  }
};