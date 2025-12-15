import api from './api.js';

const EMPLOYEE_ENDPOINT = '/employees';

export const employeeService = {
  // Get all employees
  getAll: async (params = {}) => {
    const response = await api.get(EMPLOYEE_ENDPOINT, { params });
    return response.data;
  },

  // Get employee by ID
  getById: async (id) => {
    const response = await api.get(`${EMPLOYEE_ENDPOINT}/${id}`);
    return response.data;
  },

  // Create new employee
  create: async (employeeData) => {
    const response = await api.post(EMPLOYEE_ENDPOINT, {
      ...employeeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update employee
  update: async (id, employeeData) => {
    const response = await api.put(`${EMPLOYEE_ENDPOINT}/${id}`, {
      ...employeeData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete employee
  delete: async (id) => {
    const response = await api.delete(`${EMPLOYEE_ENDPOINT}/${id}`);
    return response.data;
  },

  // Search employees
  search: async (query) => {
    const response = await api.get(`${EMPLOYEE_ENDPOINT}?q=${query}`);
    return response.data;
  },

  // Get employees by department
  getByDepartment: async (department) => {
    const response = await api.get(`${EMPLOYEE_ENDPOINT}?department=${department}`);
    return response.data;
  },

  // Get employees by status
  getByStatus: async (status) => {
    const response = await api.get(`${EMPLOYEE_ENDPOINT}?status=${status}`);
    return response.data;
  },

  // Update employee manager
  updateManager: async (employeeId, managerId) => {
    const response = await api.put(`${EMPLOYEE_ENDPOINT}/${employeeId}/manager`, {
      managerId,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },
};
