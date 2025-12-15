import api from './api.js';

const DEPARTMENT_ENDPOINT = '/departments';

export const departmentService = {
  // Get all departments
  getAll: async (params = {}) => {
    const response = await api.get(DEPARTMENT_ENDPOINT, { params });
    return response.data;
  },

  // Get department by ID
  getById: async (id) => {
    const response = await api.get(`${DEPARTMENT_ENDPOINT}/${id}`);
    return response.data;
  },

  // Create new department
  create: async (departmentData) => {
    const response = await api.post(DEPARTMENT_ENDPOINT, {
      ...departmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update department
  update: async (id, departmentData) => {
    const response = await api.put(`${DEPARTMENT_ENDPOINT}/${id}`, {
      ...departmentData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete department
  delete: async (id) => {
    const response = await api.delete(`${DEPARTMENT_ENDPOINT}/${id}`);
    return response.data;
  },

  // Update department status
  updateStatus: async (id, status) => {
    const response = await api.patch(`${DEPARTMENT_ENDPOINT}/${id}/status`, {
      status,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Search departments
  search: async (query) => {
    const response = await api.get(`${DEPARTMENT_ENDPOINT}?q=${query}`);
    return response.data;
  },

  // Get departments by status
  getByStatus: async (status) => {
    const response = await api.get(`${DEPARTMENT_ENDPOINT}?status=${status}`);
    return response.data;
  },
};
