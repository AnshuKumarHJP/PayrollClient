import api from './api.js';

const teamDashboardService = {
  // Get all team members
  getAllTeamMembers: async () => {
    try {
      const response = await api.get('/teamMembers');
      return response.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },

  // Get all team tasks
  getAllTeamTasks: async () => {
    try {
      const response = await api.get('/teamTasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching team tasks:', error);
      throw error;
    }
  },

  // Get team activity
  getTeamActivity: async () => {
    try {
      const response = await api.get('/teamActivity');
      return response.data;
    } catch (error) {
      console.error('Error fetching team activity:', error);
      throw error;
    }
  },

  // Update team member
  updateTeamMember: async (id, updates) => {
    try {
      const response = await api.patch(`/teamMembers/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  },

  // Update team task
  updateTeamTask: async (id, updates) => {
    try {
      const response = await api.patch(`/teamTasks/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating team task:', error);
      throw error;
    }
  },

  // Create new team task
  createTeamTask: async (taskData) => {
    try {
      const response = await api.post('/teamTasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating team task:', error);
      throw error;
    }
  }
};

export default teamDashboardService;
