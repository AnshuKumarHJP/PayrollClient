import api from './api.js';

const LOANS_ENDPOINT = '/loans';

export const loanService = {
  // Get all loans
  getAll: async (params = {}) => {
    const response = await api.get(LOANS_ENDPOINT, { params });
    return response.data;
  },

  // Get loan by ID
  getById: async (id) => {
    const response = await api.get(`${LOANS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get loans by employee ID
  getByEmployeeId: async (employeeId, params = {}) => {
    const response = await api.get(`${LOANS_ENDPOINT}?employeeId=${employeeId}`, { params });
    return response.data;
  },

  // Create new loan
  create: async (loanData) => {
    // Calculate EMI if not provided
    const emiAmount = loanData.emiAmount || calculateEMI(
      loanData.principalAmount,
      loanData.interestRate,
      loanData.tenureMonths
    );

    const response = await api.post(LOANS_ENDPOINT, {
      ...loanData,
      emiAmount,
      outstandingAmount: loanData.principalAmount,
      status: 'active',
      startDate: loanData.startDate || new Date().toISOString().split('T')[0],
      endDate: calculateEndDate(loanData.startDate || new Date().toISOString().split('T')[0], loanData.tenureMonths),
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update loan
  update: async (id, loanData) => {
    const response = await api.put(`${LOANS_ENDPOINT}/${id}`, loanData);
    return response.data;
  },

  // Update loan status
  updateStatus: async (id, status) => {
    const response = await api.patch(`${LOANS_ENDPOINT}/${id}`, {
      status,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete loan
  delete: async (id) => {
    const response = await api.delete(`${LOANS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Process EMI payment
  processEMIPayment: async (id, paymentAmount, paymentDate = new Date().toISOString().split('T')[0]) => {
    const loan = await loanService.getById(id);
    if (!loan) throw new Error('Loan not found');

    const newOutstandingAmount = Math.max(0, loan.outstandingAmount - paymentAmount);

    const response = await api.patch(`${LOANS_ENDPOINT}/${id}`, {
      outstandingAmount: newOutstandingAmount,
      lastPaymentDate: paymentDate,
      lastPaymentAmount: paymentAmount,
      updatedAt: new Date().toISOString(),
    });

    return response.data;
  },

  // Get loan summary for employee
  getLoanSummary: async (employeeId) => {
    const loans = await loanService.getByEmployeeId(employeeId);

    const summary = {
      totalLoans: loans.length,
      activeLoans: loans.filter(l => l.status === 'active').length,
      totalOutstanding: loans.reduce((sum, l) => sum + l.outstandingAmount, 0),
      monthlyEMI: loans.filter(l => l.status === 'active').reduce((sum, l) => sum + l.emiAmount, 0),
      loans: loans,
    };

    return summary;
  },

  // Get loans by status
  getByStatus: async (status) => {
    const response = await api.get(`${LOANS_ENDPOINT}?status=${status}`);
    return response.data;
  },

  // Bulk create loans
  bulkCreate: async (loanRecords) => {
    const records = loanRecords.map(record => ({
      ...record,
      emiAmount: record.emiAmount || calculateEMI(
        record.principalAmount,
        record.interestRate,
        record.tenureMonths
      ),
      outstandingAmount: record.principalAmount,
      status: 'active',
      startDate: record.startDate || new Date().toISOString().split('T')[0],
      endDate: calculateEndDate(record.startDate || new Date().toISOString().split('T')[0], record.tenureMonths),
      createdAt: new Date().toISOString(),
    }));

    const response = await api.post(`${LOANS_ENDPOINT}/bulk`, records);
    return response.data;
  },
};

// Helper function to calculate EMI
function calculateEMI(principal, rate, tenureMonths) {
  const monthlyRate = rate / (12 * 100);
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi * 100) / 100;
}

// Helper function to calculate end date
function calculateEndDate(startDate, tenureMonths) {
  const start = new Date(startDate);
  start.setMonth(start.getMonth() + tenureMonths);
  return start.toISOString().split('T')[0];
}
