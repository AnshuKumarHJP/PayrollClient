import api from './api.js';

const EMPLOYEE_DIRECTORY_ENDPOINT = '/employeeDirectory';

export const employeeDirectoryService = {
  // Get all employees
  getAll: async (params = {}) => {
    const response = await api.get(EMPLOYEE_DIRECTORY_ENDPOINT, { params });
    return response.data;
  },

  // Get employee by ID
  getById: async (id) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get employees by department
  getByDepartment: async (department, params = {}) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}?department=${department}`, { params });
    return response.data;
  },

  // Get employees by designation
  getByDesignation: async (designation, params = {}) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}?designation=${designation}`, { params });
    return response.data;
  },

  // Get employees by manager
  getByManager: async (managerId, params = {}) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}?managerId=${managerId}`, { params });
    return response.data;
  },

  // Get employees by work location
  getByWorkLocation: async (location, params = {}) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}?workLocation=${location}`, { params });
    return response.data;
  },

  // Get employee contacts
  getEmployeeContacts: async (id) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/contacts`);
    return response.data;
  },

  // Get employee work information
  getEmployeeWorkInfo: async (id) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/work-info`);
    return response.data;
  },

  // Get employee emergency contacts
  getEmployeeEmergencyContacts: async (id) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/emergency-contacts`);
    return response.data;
  },

  // Get employee banking information
  getEmployeeBankingInfo: async (id) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/banking-info`);
    return response.data;
  },

  // Get employee documents
  getEmployeeDocuments: async (id) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/documents`);
    return response.data;
  },

  // Get employee attendance summary
  getEmployeeAttendanceSummary: async (id, month = null) => {
    let url = `${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/attendance-summary`;
    if (month) {
      url += `?month=${month}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get employee leave balance
  getEmployeeLeaveBalance: async (id) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/leave-balance`);
    return response.data;
  },

  // Get employee salary information
  getEmployeeSalaryInfo: async (id) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/salary-info`);
    return response.data;
  },

  // Get employee performance reviews
  getEmployeePerformanceReviews: async (id, params = {}) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/performance-reviews`, { params });
    return response.data;
  },

  // Get employee training records
  getEmployeeTrainingRecords: async (id, params = {}) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/training-records`, { params });
    return response.data;
  },

  // Get employee project assignments
  getEmployeeProjectAssignments: async (id, params = {}) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/project-assignments`, { params });
    return response.data;
  },

  // Search employees
  search: async (query, params = {}) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}?q=${query}`, { params });
    return response.data;
  },

  // Advanced search
  advancedSearch: async (filters = {}) => {
    let url = EMPLOYEE_DIRECTORY_ENDPOINT;
    const params = new URLSearchParams();

    if (filters.name) params.append('name', filters.name);
    if (filters.employeeId) params.append('employeeId', filters.employeeId);
    if (filters.email) params.append('email', filters.email);
    if (filters.department) params.append('department', filters.department);
    if (filters.designation) params.append('designation', filters.designation);
    if (filters.managerId) params.append('managerId', filters.managerId);
    if (filters.workLocation) params.append('workLocation', filters.workLocation);
    if (filters.employmentType) params.append('employmentType', filters.employmentType);
    if (filters.status) params.append('status', filters.status);

    params.append('_sort', 'firstName,lastName');
    params.append('_order', 'asc,asc');

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get employee directory statistics
  getDirectoryStats: async () => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/stats`);
    return response.data;
  },

  // Get department breakdown
  getDepartmentBreakdown: async () => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/department-breakdown`);
    return response.data;
  },

  // Get designation breakdown
  getDesignationBreakdown: async () => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/designation-breakdown`);
    return response.data;
  },

  // Get location breakdown
  getLocationBreakdown: async () => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/location-breakdown`);
    return response.data;
  },

  // Export employee directory
  exportDirectory: async (filters = {}, format = 'excel') => {
    let url = `${EMPLOYEE_DIRECTORY_ENDPOINT}/export?format=${format}`;

    const params = new URLSearchParams();
    if (filters.department) params.append('department', filters.department);
    if (filters.designation) params.append('designation', filters.designation);
    if (filters.workLocation) params.append('workLocation', filters.workLocation);
    if (filters.status) params.append('status', filters.status);

    if (params.toString()) {
      url += `&${params.toString()}`;
    }

    const response = await api.get(url, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Get employee org chart
  getOrgChart: async (department = null) => {
    let url = `${EMPLOYEE_DIRECTORY_ENDPOINT}/org-chart`;
    if (department) {
      url += `?department=${department}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get reporting hierarchy
  getReportingHierarchy: async (employeeId) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/hierarchy/${employeeId}`);
    return response.data;
  },

  // Get team members
  getTeamMembers: async (managerId) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/team/${managerId}`);
    return response.data;
  },

  // Get employee anniversaries
  getAnniversaries: async (month = null) => {
    let url = `${EMPLOYEE_DIRECTORY_ENDPOINT}/anniversaries`;
    if (month) {
      url += `?month=${month}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get upcoming birthdays
  getUpcomingBirthdays: async (days = 30) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/birthdays?days=${days}`);
    return response.data;
  },

  // Get new joiners
  getNewJoiners: async (days = 30) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/new-joiners?days=${days}`);
    return response.data;
  },

  // Get employee exit information
  getEmployeeExitInfo: async (id) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/exit-info`);
    return response.data;
  },

  // Update employee profile
  updateProfile: async (id, profileData) => {
    const response = await api.put(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/profile`, {
      ...profileData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update employee contacts
  updateContacts: async (id, contactData) => {
    const response = await api.put(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/contacts`, {
      ...contactData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update employee emergency contacts
  updateEmergencyContacts: async (id, emergencyContactData) => {
    const response = await api.put(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/emergency-contacts`, {
      ...emergencyContactData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update employee banking information
  updateBankingInfo: async (id, bankingData) => {
    const response = await api.put(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/banking-info`, {
      ...bankingData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Upload employee document
  uploadDocument: async (id, documentFile, documentType) => {
    const formData = new FormData();
    formData.append('document', documentFile);
    formData.append('documentType', documentType);

    const response = await api.post(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download employee document
  downloadDocument: async (id, documentId) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/documents/${documentId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Delete employee document
  deleteDocument: async (id, documentId) => {
    const response = await api.delete(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/documents/${documentId}`);
    return response.data;
  },

  // Get employee activity log
  getEmployeeActivityLog: async (id, params = {}) => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/${id}/activity-log`, { params });
    return response.data;
  },

  // Bulk update employee information
  bulkUpdate: async (updates) => {
    const updatesWithTimestamps = updates.map(update => ({
      ...update,
      updatedAt: new Date().toISOString(),
    }));

    const response = await api.put(`${EMPLOYEE_DIRECTORY_ENDPOINT}/bulk`, { updates: updatesWithTimestamps });
    return response.data;
  },

  // Get employee directory settings
  getDirectorySettings: async () => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/settings`);
    return response.data;
  },

  // Update employee directory settings
  updateDirectorySettings: async (settings) => {
    const response = await api.put(`${EMPLOYEE_DIRECTORY_ENDPOINT}/settings`, {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get employee directory fields configuration
  getDirectoryFields: async () => {
    const response = await api.get(`${EMPLOYEE_DIRECTORY_ENDPOINT}/fields`);
    return response.data;
  },

  // Update employee directory fields configuration
  updateDirectoryFields: async (fieldsConfig) => {
    const response = await api.put(`${EMPLOYEE_DIRECTORY_ENDPOINT}/fields`, {
      ...fieldsConfig,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },
};
