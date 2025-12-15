import api from './api.js';

const LEAVE_RECORDS_ENDPOINT = '/leaveRecords';
const LEAVE_BALANCES_ENDPOINT = '/leaveBalances';

export const leaveService = {
  // Leave Records
  // Get all leave records
  getAllRecords: async (params = {}) => {
    const response = await api.get(LEAVE_RECORDS_ENDPOINT, { params });
    return response.data;
  },

  // Get leave record by ID
  getRecordById: async (id) => {
    const response = await api.get(`${LEAVE_RECORDS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get leave records by employee ID
  getRecordsByEmployeeId: async (employeeId, params = {}) => {
    const response = await api.get(`${LEAVE_RECORDS_ENDPOINT}?employeeId=${employeeId}`, { params });
    return response.data;
  },

  // Create leave request
  createLeaveRequest: async (leaveData) => {
    const response = await api.post(LEAVE_RECORDS_ENDPOINT, {
      ...leaveData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update leave request
  updateLeaveRequest: async (id, leaveData) => {
    const response = await api.put(`${LEAVE_RECORDS_ENDPOINT}/${id}`, {
      ...leaveData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Approve/Reject leave request
  updateLeaveStatus: async (id, status, approvedBy = null, comments = null) => {
    const updateData = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (approvedBy) updateData.approvedBy = approvedBy;
    if (comments) updateData.comments = comments;

    const response = await api.patch(`${LEAVE_RECORDS_ENDPOINT}/${id}`, updateData);
    return response.data;
  },

  // Delete leave record
  deleteLeaveRecord: async (id) => {
    const response = await api.delete(`${LEAVE_RECORDS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Bulk create leave records
  bulkCreateLeaveRecords: async (leaveRecords) => {
    const records = leaveRecords.map(record => ({
      ...record,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const response = await api.post(`${LEAVE_RECORDS_ENDPOINT}/bulk`, records);
    return response.data;
  },

  // Leave Balances
  // Get all leave balances
  getAllBalances: async (params = {}) => {
    const response = await api.get(LEAVE_BALANCES_ENDPOINT, { params });
    return response.data;
  },

  // Get leave balance by ID
  getBalanceById: async (id) => {
    const response = await api.get(`${LEAVE_BALANCES_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get leave balance by employee ID
  getBalanceByEmployeeId: async (employeeId, year = new Date().getFullYear()) => {
    const response = await api.get(`${LEAVE_BALANCES_ENDPOINT}?employeeId=${employeeId}&year=${year}`);
    return response.data[0] || null;
  },

  // Create leave balance
  createLeaveBalance: async (balanceData) => {
    const response = await api.post(LEAVE_BALANCES_ENDPOINT, balanceData);
    return response.data;
  },

  // Update leave balance
  updateLeaveBalance: async (id, balanceData) => {
    const response = await api.put(`${LEAVE_BALANCES_ENDPOINT}/${id}`, balanceData);
    return response.data;
  },

  // Update leave balance after leave approval
  updateBalanceAfterLeave: async (employeeId, leaveType, days, year = new Date().getFullYear()) => {
    const balance = await leaveService.getBalanceByEmployeeId(employeeId, year);
    if (!balance) return null;

    const updateData = {};
    if (leaveType === 'annual') {
      updateData.usedAnnual = balance.usedAnnual + days;
    } else if (leaveType === 'sick') {
      updateData.usedSick = balance.usedSick + days;
    }

    const response = await api.put(`${LEAVE_BALANCES_ENDPOINT}/${balance.id}`, updateData);
    return response.data;
  },

  // Get leave summary for employee
  getLeaveSummary: async (employeeId, year = new Date().getFullYear()) => {
    const [balance, records] = await Promise.all([
      leaveService.getBalanceByEmployeeId(employeeId, year),
      leaveService.getRecordsByEmployeeId(employeeId, { year })
    ]);

    if (!balance) return null;

    const approvedLeaves = records.filter(r => r.status === 'approved');
    const pendingLeaves = records.filter(r => r.status === 'pending');

    return {
      balance,
      approvedLeavesCount: approvedLeaves.length,
      pendingLeavesCount: pendingLeaves.length,
      totalApprovedDays: approvedLeaves.reduce((sum, r) => sum + r.days, 0),
      totalPendingDays: pendingLeaves.reduce((sum, r) => sum + r.days, 0),
    };
  },
};
