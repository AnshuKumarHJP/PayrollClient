import api from './api.js';

const approveRejectService = {
  // Approve a task
  approveTask: async (taskId, comments = '') => {
    try {
      const response = await api.put(`/tasks/${taskId}`, {
        status: 'approved',
        comments,
        approvedAt: new Date().toISOString(),
        approvedBy: 'current_user' // In a real app, this would come from auth context
      });
      return response.data;
    } catch (error) {
      console.error('Error approving task:', error);
      throw error;
    }
  },

  // Reject a task
  rejectTask: async (taskId, comments = '') => {
    try {
      const response = await api.put(`/tasks/${taskId}`, {
        status: 'rejected',
        comments,
        rejectedAt: new Date().toISOString(),
        rejectedBy: 'current_user' // In a real app, this would come from auth context
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting task:', error);
      throw error;
    }
  },

  // Send task back for review
  sendBackTask: async (taskId, comments = '') => {
    try {
      const response = await api.put(`/tasks/${taskId}`, {
        status: 'pending_action',
        comments,
        sentBackAt: new Date().toISOString(),
        sentBackBy: 'current_user' // In a real app, this would come from auth context
      });
      return response.data;
    } catch (error) {
      console.error('Error sending back task:', error);
      throw error;
    }
  },

  // Get task details for approval/rejection
  getTaskForApproval: async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task for approval:', error);
      throw error;
    }
  },

  // Get approval history for a task
  getApprovalHistory: async (taskId) => {
    try {
      const response = await api.get(`/auditLogs?entityType=task&entityId=${taskId}&action=APPROVE_TASK`);
      return response.data;
    } catch (error) {
      console.error('Error fetching approval history:', error);
      throw error;
    }
  }
};

export default approveRejectService;
