import api from './api.js';

const opsDashboardService = {
  // Get all dashboard data
  getAllDashboardData: async () => {
    try {
      const response = await api.get('/opsDashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Get operator stats
  getOperatorStats: async () => {
    try {
      const response = await api.get('/operatorStats');
      return response.data;
    } catch (error) {
      console.error('Error fetching operator stats:', error);
      throw error;
    }
  },

  // Get system alerts
  getSystemAlerts: async () => {
    try {
      const response = await api.get('/systemAlerts');
      return response.data;
    } catch (error) {
      console.error('Error fetching system alerts:', error);
      throw error;
    }
  },

  // Update operator stats
  updateOperatorStats: async (id, updates) => {
    try {
      const response = await api.patch(`/operatorStats/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating operator stats:', error);
      throw error;
    }
  },

  // Update system alert
  updateSystemAlert: async (id, updates) => {
    try {
      const response = await api.patch(`/systemAlerts/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating system alert:', error);
      throw error;
    }
  }
};

export default opsDashboardService;
