import api from './api.js';

const REIMBURSEMENTS_ENDPOINT = '/reimbursements';

export const reimbursementService = {
  // Get all reimbursements
  getAll: async (params = {}) => {
    const response = await api.get(REIMBURSEMENTS_ENDPOINT, { params });
    return response.data;
  },

  // Get reimbursement by ID
  getById: async (id) => {
    const response = await api.get(`${REIMBURSEMENTS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get reimbursements by employee ID
  getByEmployeeId: async (employeeId, params = {}) => {
    const response = await api.get(`${REIMBURSEMENTS_ENDPOINT}?employeeId=${employeeId}`, { params });
    return response.data;
  },

  // Create reimbursement request
  create: async (reimbursementData) => {
    const response = await api.post(REIMBURSEMENTS_ENDPOINT, {
      ...reimbursementData,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update reimbursement
  update: async (id, reimbursementData) => {
    const response = await api.put(`${REIMBURSEMENTS_ENDPOINT}/${id}`, reimbursementData);
    return response.data;
  },

  // Update reimbursement status
  updateStatus: async (id, status, approvedBy = null, approvedDate = null) => {
    const updateData = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (approvedBy) updateData.approvedBy = approvedBy;
    if (approvedDate) updateData.approvedDate = approvedDate;

    const response = await api.patch(`${REIMBURSEMENTS_ENDPOINT}/${id}`, updateData);
    return response.data;
  },

  // Delete reimbursement
  delete: async (id) => {
    const response = await api.delete(`${REIMBURSEMENTS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Bulk create reimbursements
  bulkCreate: async (reimbursementRecords) => {
    const records = reimbursementRecords.map(record => ({
      ...record,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    }));

    const response = await api.post(`${REIMBURSEMENTS_ENDPOINT}/bulk`, records);
    return response.data;
  },

  // Get reimbursements by status
  getByStatus: async (status) => {
    const response = await api.get(`${REIMBURSEMENTS_ENDPOINT}?status=${status}`);
    return response.data;
  },

  // Get reimbursements by category
  getByCategory: async (category) => {
    const response = await api.get(`${REIMBURSEMENTS_ENDPOINT}?category=${category}`);
    return response.data;
  },

  // Get reimbursement summary for employee
  getReimbursementSummary: async (employeeId) => {
    const reimbursements = await reimbursementService.getByEmployeeId(employeeId);

    const summary = {
      totalClaims: reimbursements.length,
      pendingClaims: reimbursements.filter(r => r.status === 'pending').length,
      approvedClaims: reimbursements.filter(r => r.status === 'approved').length,
      rejectedClaims: reimbursements.filter(r => r.status === 'rejected').length,
      totalPendingAmount: reimbursements
        .filter(r => r.status === 'pending')
        .reduce((sum, r) => sum + r.amount, 0),
      totalApprovedAmount: reimbursements
        .filter(r => r.status === 'approved')
        .reduce((sum, r) => sum + r.amount, 0),
      reimbursements: reimbursements,
    };

    return summary;
  },

  // Process reimbursement payment
  processPayment: async (id, paymentDate = new Date().toISOString().split('T')[0]) => {
    const response = await api.patch(`${REIMBURSEMENTS_ENDPOINT}/${id}`, {
      status: 'paid',
      paymentDate,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get monthly reimbursement summary
  getMonthlySummary: async (year, month) => {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const response = await api.get(
      `${REIMBURSEMENTS_ENDPOINT}?submittedDate_gte=${startDate}&submittedDate_lte=${endDate}`
    );

    const records = response.data;
    const summary = {
      totalClaims: records.length,
      totalAmount: records.reduce((sum, r) => sum + r.amount, 0),
      approvedAmount: records
        .filter(r => r.status === 'approved')
        .reduce((sum, r) => sum + r.amount, 0),
      pendingAmount: records
        .filter(r => r.status === 'pending')
        .reduce((sum, r) => sum + r.amount, 0),
      categories: {},
    };

    // Group by category
    records.forEach(record => {
      if (!summary.categories[record.category]) {
        summary.categories[record.category] = {
          count: 0,
          amount: 0,
        };
      }
      summary.categories[record.category].count++;
      summary.categories[record.category].amount += record.amount;
    });

    return summary;
  },
};
