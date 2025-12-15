import { api } from './api.js';

export const validationErrorsService = {
  // Get all validation errors
  getAll: async () => {
    try {
      const response = await api.get('/validationErrors');
      return response.data;
    } catch (error) {
      console.error('Error fetching validation errors:', error);
      throw error;
    }
  },

  // Get validation error by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/validationErrors/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching validation error:', error);
      throw error;
    }
  },

  // Get validation errors by upload ID
  getByUploadId: async (uploadId) => {
    try {
      const response = await api.get(`/validationErrors?uploadId=${uploadId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching validation errors by upload:', error);
      throw error;
    }
  },

  // Create new validation error
  create: async (validationErrorData) => {
    try {
      const validationError = {
        ...validationErrorData,
        createdAt: new Date().toISOString()
      };
      const response = await api.post('/validationErrors', validationError);
      return response.data;
    } catch (error) {
      console.error('Error creating validation error:', error);
      throw error;
    }
  },

  // Update validation error
  update: async (id, validationErrorData) => {
    try {
      const response = await api.put(`/validationErrors/${id}`, validationErrorData);
      return response.data;
    } catch (error) {
      console.error('Error updating validation error:', error);
      throw error;
    }
  },

  // Delete validation error
  delete: async (id) => {
    try {
      const response = await api.delete(`/validationErrors/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting validation error:', error);
      throw error;
    }
  },

  // Bulk create validation errors
  createBulk: async (validationErrors) => {
    try {
      const errorsWithTimestamps = validationErrors.map(error => ({
        ...error,
        createdAt: new Date().toISOString()
      }));
      const response = await api.post('/validationErrors', errorsWithTimestamps);
      return response.data;
    } catch (error) {
      console.error('Error creating bulk validation errors:', error);
      throw error;
    }
  }
};
