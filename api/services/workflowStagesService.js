import { api } from './api.js';

export const workflowStagesService = {
  // Get all workflow stages
  getAll: async () => {
    try {
      const response = await api.get('/workflowStages');
      return response.data;
    } catch (error) {
      console.error('Error fetching workflow stages:', error);
      throw error;
    }
  },

  // Get workflow stage by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/workflowStages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workflow stage:', error);
      throw error;
    }
  },

  // Get workflow stages by cycle ID
  getByCycle: async (cycleId) => {
    try {
      const response = await api.get(`/workflowStages?cycleId=${cycleId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workflow stages by cycle:', error);
      throw error;
    }
  },

  // Create new workflow stage
  create: async (stageData) => {
    try {
      const stage = {
        ...stageData,
        status: stageData.status || 'pending',
        completedBy: null,
        completedAt: null
      };
      const response = await api.post('/workflowStages', stage);
      return response.data;
    } catch (error) {
      console.error('Error creating workflow stage:', error);
      throw error;
    }
  },

  // Update workflow stage
  update: async (id, stageData) => {
    try {
      const response = await api.put(`/workflowStages/${id}`, stageData);
      return response.data;
    } catch (error) {
      console.error('Error updating workflow stage:', error);
      throw error;
    }
  },

  // Delete workflow stage
  delete: async (id) => {
    try {
      const response = await api.delete(`/workflowStages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting workflow stage:', error);
      throw error;
    }
  },

  // Complete workflow stage
  complete: async (id, completedBy) => {
    try {
      const response = await api.patch(`/workflowStages/${id}`, {
        status: 'completed',
        completedBy: completedBy,
        completedAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error completing workflow stage:', error);
      throw error;
    }
  }
};
