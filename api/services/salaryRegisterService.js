import api from './api.js';

const SALARY_REGISTER_ENDPOINT = '/salaryRegister';

export const salaryRegisterService = {
  // Get all salary register entries
  getAll: async (params = {}) => {
    const response = await api.get(SALARY_REGISTER_ENDPOINT, { params });
    return response.data;
  },

  // Get salary register by ID
  getById: async (id) => {
    const response = await api.get(`${SALARY_REGISTER_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get salary register by payroll cycle
  getByPayrollCycle: async (cycleId, params = {}) => {
    const response = await api.get(`${SALARY_REGISTER_ENDPOINT}?cycleId=${cycleId}`, { params });
    return response.data;
  },

  // Get salary register by employee
  getByEmployee: async (employeeId, params = {}) => {
    const response = await api.get(`${SALARY_REGISTER_ENDPOINT}?employeeId=${employeeId}`, { params });
    return response.data;
  },

  // Get salary register by department
  getByDepartment: async (department, params = {}) => {
    const response = await api.get(`${SALARY_REGISTER_ENDPOINT}?department=${department}`, { params });
    return response.data;
  },

  // Create salary register entry
  create: async (salaryData) => {
    const response = await api.post(SALARY_REGISTER_ENDPOINT, {
      ...salaryData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update salary register entry
  update: async (id, salaryData) => {
    const response = await api.put(`${SALARY_REGISTER_ENDPOINT}/${id}`, salaryData);
    return response.data;
  },

  // Delete salary register entry
  delete: async (id) => {
    const response = await api.delete(`${SALARY_REGISTER_ENDPOINT}/${id}`);
    return response.data;
  },

  // Bulk create salary register entries
  bulkCreate: async (salaryRecords) => {
    const records = salaryRecords.map(record => ({
      ...record,
      createdAt: new Date().toISOString(),
    }));

    const response = await api.post(`${SALARY_REGISTER_ENDPOINT}/bulk`, records);
    return response.data;
  },

  // Get salary register summary
  getSalarySummary: async (cycleId = null, department = null) => {
    let url = `${SALARY_REGISTER_ENDPOINT}?_limit=1000`;

    if (cycleId) {
      url += `&cycleId=${cycleId}`;
    }

    if (department) {
      url += `&department=${department}`;
    }

    const salaries = await api.get(url).then(res => res.data);

    const summary = {
      totalEmployees: salaries.length,
      totalBasicSalary: salaries.reduce((sum, s) => sum + s.basicSalary, 0),
      totalHRA: salaries.reduce((sum, s) => sum + s.hra, 0),
      totalConveyance: salaries.reduce((sum, s) => sum + s.conveyance, 0),
      totalLTA: salaries.reduce((sum, s) => sum + s.lta, 0),
      totalMedical: salaries.reduce((sum, s) => sum + s.medical, 0),
      totalOtherAllowances: salaries.reduce((sum, s) => sum + s.otherAllowances, 0),
      totalGrossSalary: salaries.reduce((sum, s) => sum + s.totalEarnings, 0),
      totalPF: salaries.reduce((sum, s) => sum + s.pf, 0),
      totalProfessionalTax: salaries.reduce((sum, s) => sum + s.professionalTax, 0),
      totalIncomeTax: salaries.reduce((sum, s) => sum + s.incomeTax, 0),
      totalOtherDeductions: salaries.reduce((sum, s) => sum + s.otherDeductions, 0),
      totalDeductions: salaries.reduce((sum, s) => sum + s.totalDeductions, 0),
      totalNetSalary: salaries.reduce((sum, s) => sum + s.netSalary, 0),
      averageSalary: salaries.length > 0 ? Math.round(salaries.reduce((sum, s) => sum + s.netSalary, 0) / salaries.length) : 0,
    };

    return summary;
  },

  // Export salary register to Excel
  exportToExcel: async (cycleId = null, department = null) => {
    let url = `${SALARY_REGISTER_ENDPOINT}/export`;

    const params = {};
    if (cycleId) params.cycleId = cycleId;
    if (department) params.department = department;

    const response = await api.get(url, {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  // Export salary register to PDF
  exportToPDF: async (cycleId = null, department = null) => {
    let url = `${SALARY_REGISTER_ENDPOINT}/export/pdf`;

    const params = {};
    if (cycleId) params.cycleId = cycleId;
    if (department) params.department = department;

    const response = await api.get(url, {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  // Search salary register
  search: async (query, params = {}) => {
    const response = await api.get(`${SALARY_REGISTER_ENDPOINT}?q=${query}`, { params });
    return response.data;
  },

  // Get salary register with filters
  getFilteredSalaries: async (filters = {}) => {
    let url = SALARY_REGISTER_ENDPOINT;
    const params = new URLSearchParams();

    if (filters.cycleId) params.append('cycleId', filters.cycleId);
    if (filters.department) params.append('department', filters.department);
    if (filters.employeeId) params.append('employeeId', filters.employeeId);
    if (filters.status) params.append('status', filters.status);
    if (filters.minSalary) params.append('netSalary_gte', filters.minSalary);
    if (filters.maxSalary) params.append('netSalary_lte', filters.maxSalary);

    params.append('_sort', 'employeeName');
    params.append('_order', 'asc');

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  },
};
