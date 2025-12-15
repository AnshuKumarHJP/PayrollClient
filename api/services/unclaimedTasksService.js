import apiService from './api';

const unclaimedTasksService = {
  getUnclaimedTasks: async (filters = {}) => {
    try {
      const response = await apiService.get('/unclaimedTasks', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching unclaimed tasks:', error);
      throw error;
    }
  },

  claimTask: async (taskId) => {
    try {
      const response = await apiService.post(`/tasks/${taskId}/claim`);
      return response.data;
    } catch (error) {
      console.error('Error claiming task:', error);
      throw error;
    }
  },

  assignTask: async (taskId, userId) => {
    try {
      const response = await apiService.post(`/tasks/${taskId}/assign`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error assigning task:', error);
      throw error;
    }
  },

  getAvailableUsers: async () => {
    try {
      const response = await apiService.get('/availableUsers');
      return response.data;
    } catch (error) {
      console.error('Error fetching available users:', error);
      throw error;
    }
  }
};

export default unclaimedTasksService;
