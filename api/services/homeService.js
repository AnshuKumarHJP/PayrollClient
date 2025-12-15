import api from './api.js';

const homeService = {
  // Get dashboard summary data
  async getDashboardSummary() {
    try {
      const response = await api.get('/dashboard/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  },

  // Get recent activities
  async getRecentActivities() {
    try {
      const response = await api.get('/activities/recent');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },

  // Get quick stats
  async getQuickStats() {
    try {
      const response = await api.get('/stats/quick');
      return response.data;
    } catch (error) {
      console.error('Error fetching quick stats:', error);
      throw error;
    }
  },

  // Get pending tasks count
  async getPendingTasksCount() {
    try {
      const response = await api.get('/tasks/pending/count');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending tasks count:', error);
      throw error;
    }
  }
};

export default homeService;
