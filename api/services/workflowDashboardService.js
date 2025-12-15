import api from './api.js';

const workflowDashboardService = {
  // Get all workflow tasks for dashboard
  getAllWorkflowTasks: async () => {
    try {
      const response = await api.get('/workflowTasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching workflow tasks:', error);
      throw error;
    }
  },

  // Get workflow statistics
  getWorkflowStats: async () => {
    try {
      const response = await api.get('/workflowStats');
      return response.data;
    } catch (error) {
      console.error('Error fetching workflow stats:', error);
      throw error;
    }
  },

  // Get operator performance data
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
  }
};

export default workflowDashboardService;
