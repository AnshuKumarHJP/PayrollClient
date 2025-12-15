import api from './api.js';

const severityLevelsService = {
  // Get all severity levels
  async getAllSeverityLevels() {
    try {
      const response = await api.get('/severityLevels');
      return response.data;
    } catch (error) {
      console.error('Error fetching severity levels:', error);
      throw error;
    }
  },

  // Get severity level by ID
  async getSeverityLevelById(id) {
    try {
      const response = await api.get(`/severityLevels/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching severity level:', error);
      throw error;
    }
  }
};

export default severityLevelsService;
