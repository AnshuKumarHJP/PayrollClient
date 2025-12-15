import { api } from './api.js';

export const leaveBalancesService = {
  // Get all leave balances
  getAll: async () => {
    try {
      const response = await api.get('/leaveBalances');
      return response.data;
    } catch (error) {
      console.error('Error fetching leave balances:', error);
      throw error;
    }
  },

  // Get leave balance by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/leaveBalances/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leave balance:', error);
      throw error;
    }
  },

  // Get leave balance by employee
  getByEmployee: async (employeeId) => {
    try {
      const response = await api.get(`/leaveBalances?employeeId=${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leave balance by employee:', error);
      throw error;
    }
  },

  // Create new leave balance
  create: async (leaveBalanceData) => {
    try {
      const leaveBalance = {
        ...leaveBalanceData,
        year: leaveBalanceData.year || new Date().getFullYear()
      };
      const response = await api.post('/leaveBalances', leaveBalance);
      return response.data;
    } catch (error) {
      console.error('Error creating leave balance:', error);
      throw error;
    }
  },

  // Update leave balance
  update: async (id, leaveBalanceData) => {
    try {
      const response = await api.put(`/leaveBalances/${id}`, leaveBalanceData);
      return response.data;
    } catch (error) {
      console.error('Error updating leave balance:', error);
      throw error;
    }
  },

  // Delete leave balance
  delete: async (id) => {
    try {
      const response = await api.delete(`/leaveBalances/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting leave balance:', error);
      throw error;
    }
  },

  // Update leave usage
  updateLeaveUsage: async (employeeId, leaveType, daysUsed) => {
    try {
      // Get current balance
      const balances = await leaveBalancesService.getByEmployee(employeeId);
      const currentBalance = balances[0];

      if (!currentBalance) {
        throw new Error('Leave balance not found for employee');
      }

      const updateData = {};
      if (leaveType === 'annual') {
        updateData.usedAnnual = currentBalance.usedAnnual + daysUsed;
      } else if (leaveType === 'sick') {
        updateData.usedSick = currentBalance.usedSick + daysUsed;
      }

      const response = await api.put(`/leaveBalances/${currentBalance.id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating leave usage:', error);
      throw error;
    }
  }
};
