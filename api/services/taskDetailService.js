import apiService from './api';

const taskDetailService = {
  getTaskById: async (taskId) => {
    try {
      const response = await apiService.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task details:', error);
      throw error;
    }
  },

  updateTaskStatus: async (taskId, status, comments) => {
    try {
      const response = await apiService.put(`/tasks/${taskId}/status`, { status, comments });
      return response.data;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  },

  addComment: async (taskId, comment) => {
    try {
      const response = await apiService.post(`/tasks/${taskId}/comments`, { comment });
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }
};

export default taskDetailService;
