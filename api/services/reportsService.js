import api from './api.js';

const REPORTS_ENDPOINT = '/reports';

export const reportsService = {
  // Get all reports
  getAll: async (params = {}) => {
    const response = await api.get(REPORTS_ENDPOINT, { params });
    return response.data;
  },

  // Get report by ID
  getById: async (id) => {
    const response = await api.get(`${REPORTS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get reports by category
  getByCategory: async (category, params = {}) => {
    const response = await api.get(`${REPORTS_ENDPOINT}?category=${category}`, { params });
    return response.data;
  },

  // Generate payroll summary report
  generatePayrollSummary: async (cycleId, filters = {}) => {
    const response = await api.post(`${REPORTS_ENDPOINT}/payroll-summary`, {
      cycleId,
      filters,
      generatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Generate employee attendance report
  generateAttendanceReport: async (startDate, endDate, filters = {}) => {
    const response = await api.post(`${REPORTS_ENDPOINT}/attendance`, {
      startDate,
      endDate,
      filters,
      generatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Generate leave utilization report
  generateLeaveReport: async (year, filters = {}) => {
    const response = await api.post(`${REPORTS_ENDPOINT}/leave-utilization`, {
      year,
      filters,
      generatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Generate salary register report
  generateSalaryRegister: async (cycleId, filters = {}) => {
    const response = await api.post(`${REPORTS_ENDPOINT}/salary-register`, {
      cycleId,
      filters,
      generatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Generate reimbursement summary report
  generateReimbursementReport: async (startDate, endDate, filters = {}) => {
    const response = await api.post(`${REPORTS_ENDPOINT}/reimbursements`, {
      startDate,
      endDate,
      filters,
      generatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Generate loan outstanding report
  generateLoanReport: async (filters = {}) => {
    const response = await api.post(`${REPORTS_ENDPOINT}/loans`, {
      filters,
      generatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Generate team performance report
  generateTeamPerformanceReport: async (startDate, endDate, filters = {}) => {
    const response = await api.post(`${REPORTS_ENDPOINT}/team-performance`, {
      startDate,
      endDate,
      filters,
      generatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Generate custom report
  generateCustomReport: async (reportConfig) => {
    const response = await api.post(`${REPORTS_ENDPOINT}/custom`, {
      ...reportConfig,
      generatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get report data for preview
  getReportPreview: async (reportType, params = {}) => {
    const response = await api.get(`${REPORTS_ENDPOINT}/preview/${reportType}`, { params });
    return response.data;
  },

  // Export report to Excel
  exportReportToExcel: async (reportId) => {
    const response = await api.get(`${REPORTS_ENDPOINT}/${reportId}/export/excel`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Export report to PDF
  exportReportToPDF: async (reportId) => {
    const response = await api.get(`${REPORTS_ENDPOINT}/${reportId}/export/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Schedule automated report
  scheduleReport: async (scheduleData) => {
    const response = await api.post(`${REPORTS_ENDPOINT}/schedule`, {
      ...scheduleData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get scheduled reports
  getScheduledReports: async (params = {}) => {
    const response = await api.get(`${REPORTS_ENDPOINT}/scheduled`, { params });
    return response.data;
  },

  // Update scheduled report
  updateScheduledReport: async (id, scheduleData) => {
    const response = await api.put(`${REPORTS_ENDPOINT}/scheduled/${id}`, scheduleData);
    return response.data;
  },

  // Delete scheduled report
  deleteScheduledReport: async (id) => {
    const response = await api.delete(`${REPORTS_ENDPOINT}/scheduled/${id}`);
    return response.data;
  },

  // Get report templates
  getReportTemplates: async () => {
    const response = await api.get(`${REPORTS_ENDPOINT}/templates`);
    return response.data;
  },

  // Save report template
  saveReportTemplate: async (templateData) => {
    const response = await api.post(`${REPORTS_ENDPOINT}/templates`, {
      ...templateData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get report history
  getReportHistory: async (params = {}) => {
    const response = await api.get(`${REPORTS_ENDPOINT}/history`, { params });
    return response.data;
  },

  // Get dashboard metrics
  getDashboardMetrics: async () => {
    const response = await api.get(`${REPORTS_ENDPOINT}/dashboard`);
    return response.data;
  },

  // Get report statistics
  getReportStats: async (dateRange = null) => {
    let url = `${REPORTS_ENDPOINT}/stats`;

    if (dateRange) {
      url += `?startDate=${dateRange.start}&endDate=${dateRange.end}`;
    }

    const response = await api.get(url);
    return response.data;
  },
};
