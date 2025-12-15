import api from './api.js';

const designationService = {
  // Get all designations
  getAllDesignations: async () => {
    try {
      const response = await api.get('/designations');
      return response.data;
    } catch (error) {
      console.error('Error fetching designations:', error);
      throw error;
    }
  },

  // Get designations by department
  getDesignationsByDepartment: async (departmentId) => {
    try {
      const response = await api.get(`/designations?departmentId=${departmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching designations by department:', error);
      throw error;
    }
  },

  // Get designation by ID
  getDesignationById: async (id) => {
    try {
      const response = await api.get(`/designations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching designation:', error);
      throw error;
    }
  },

  // Create designation
  createDesignation: async (designationData) => {
    try {
      const response = await api.post('/designations', designationData);
      return response.data;
    } catch (error) {
      console.error('Error creating designation:', error);
      throw error;
    }
  },

  // Update designation
  updateDesignation: async (id, designationData) => {
    try {
      const response = await api.put(`/designations/${id}`, designationData);
      return response.data;
    } catch (error) {
      console.error('Error updating designation:', error);
      throw error;
    }
  },

  // Delete designation
  deleteDesignation: async (id) => {
    try {
      const response = await api.delete(`/designations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting designation:', error);
      throw error;
    }
  }
};

export default designationService;
