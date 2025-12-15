import apiService from './api';

const taskActionService = {
  getTaskForAction: async (taskId) => {
    try {
      const response = await apiService.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task for action:', error);
      throw error;
    }
  },

  submitTaskAction: async (taskId, actionData) => {
    try {
      const response = await apiService.post(`/tasks/${taskId}/action`, actionData);
      return response.data;
    } catch (error) {
      console.error('Error submitting task action:', error);
      throw error;
    }
  }
};

export default taskActionService;
