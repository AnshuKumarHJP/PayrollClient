import api from './api.js';

const AUDIT_LOGS_ENDPOINT = '/auditLogs';

export const auditLogService = {
  // Get all audit logs
  getAll: async (params = {}) => {
    const response = await api.get(AUDIT_LOGS_ENDPOINT, { params });
    return response.data;
  },

  // Get audit log by ID
  getById: async (id) => {
    const response = await api.get(`${AUDIT_LOGS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get audit logs by user
  getByUser: async (userId, params = {}) => {
    const response = await api.get(`${AUDIT_LOGS_ENDPOINT}?userId=${userId}`, { params });
    return response.data;
  },

  // Get audit logs by module
  getByModule: async (module, params = {}) => {
    const response = await api.get(`${AUDIT_LOGS_ENDPOINT}?module=${module}`, { params });
    return response.data;
  },

  // Get audit logs by action
  getByAction: async (action, params = {}) => {
    const response = await api.get(`${AUDIT_LOGS_ENDPOINT}?action=${action}`, { params });
    return response.data;
  },

  // Get audit logs by date range
  getByDateRange: async (startDate, endDate, params = {}) => {
    const response = await api.get(`${AUDIT_LOGS_ENDPOINT}?timestamp_gte=${startDate}&timestamp_lte=${endDate}`, { params });
    return response.data;
  },

  // Create audit log entry
  create: async (logData) => {
    const response = await api.post(AUDIT_LOGS_ENDPOINT, {
      ...logData,
      timestamp: logData.timestamp || new Date().toISOString(),
      ipAddress: logData.ipAddress || null,
      userAgent: logData.userAgent || null,
    });
    return response.data;
  },

  // Bulk create audit logs
  bulkCreate: async (logsData) => {
    const logs = logsData.map(log => ({
      ...log,
      timestamp: log.timestamp || new Date().toISOString(),
      ipAddress: log.ipAddress || null,
      userAgent: log.userAgent || null,
    }));

    const response = await api.post(`${AUDIT_LOGS_ENDPOINT}/bulk`, logs);
    return response.data;
  },

  // Get audit log statistics
  getStatistics: async (dateRange = null) => {
    let url = `${AUDIT_LOGS_ENDPOINT}/statistics`;
    if (dateRange) {
      url += `?startDate=${dateRange.start}&endDate=${dateRange.end}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get audit log summary
  getSummary: async (params = {}) => {
    const response = await api.get(`${AUDIT_LOGS_ENDPOINT}/summary`, { params });
    return response.data;
  },

  // Search audit logs
  search: async (query, params = {}) => {
    const response = await api.get(`${AUDIT_LOGS_ENDPOINT}?q=${query}`, { params });
    return response.data;
  },

  // Get audit logs with filters
  getFilteredLogs: async (filters = {}) => {
    let url = AUDIT_LOGS_ENDPOINT;
    const params = new URLSearchParams();

    if (filters.userId) params.append('userId', filters.userId);
    if (filters.module) params.append('module', filters.module);
    if (filters.action) params.append('action', filters.action);
    if (filters.startDate) params.append('timestamp_gte', filters.startDate);
    if (filters.endDate) params.append('timestamp_lte', filters.endDate);
    if (filters.ipAddress) params.append('ipAddress', filters.ipAddress);

    params.append('_sort', 'timestamp');
    params.append('_order', 'desc');

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Export audit logs
  exportLogs: async (filters = {}, format = 'excel') => {
    let url = `${AUDIT_LOGS_ENDPOINT}/export?format=${format}`;

    const params = new URLSearchParams();
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.module) params.append('module', filters.module);
    if (filters.action) params.append('action', filters.action);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    if (params.toString()) {
      url += `&${params.toString()}`;
    }

    const response = await api.get(url, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Get audit log details with related data
  getLogDetails: async (id) => {
    const [log, relatedLogs] = await Promise.all([
      auditLogService.getById(id),
      api.get(`${AUDIT_LOGS_ENDPOINT}?userId=${log.userId}&timestamp_gte=${new Date(Date.parse(log.timestamp) - 3600000).toISOString()}&timestamp_lte=${new Date(Date.parse(log.timestamp) + 3600000).toISOString()}`)
    ]);

    return {
      ...log,
      relatedLogs: relatedLogs.data.filter(l => l.id !== id).slice(0, 5),
    };
  },

  // Get user activity timeline
  getUserActivityTimeline: async (userId, days = 30) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await auditLogService.getByUser(userId, {
      timestamp_gte: startDate.toISOString(),
      timestamp_lte: endDate.toISOString(),
      _sort: 'timestamp',
      _order: 'asc'
    });

    // Group by date
    const timeline = {};
    logs.forEach(log => {
      const date = log.timestamp.split('T')[0];
      if (!timeline[date]) {
        timeline[date] = [];
      }
      timeline[date].push(log);
    });

    return timeline;
  },

  // Get module activity summary
  getModuleActivity: async (module, dateRange = null) => {
    let url = `${AUDIT_LOGS_ENDPOINT}/module-activity/${module}`;
    if (dateRange) {
      url += `?startDate=${dateRange.start}&endDate=${dateRange.end}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get security events
  getSecurityEvents: async (params = {}) => {
    const response = await api.get(`${AUDIT_LOGS_ENDPOINT}/security-events`, { params });
    return response.data;
  },

  // Get failed login attempts
  getFailedLogins: async (userId = null, params = {}) => {
    let url = `${AUDIT_LOGS_ENDPOINT}/failed-logins`;
    if (userId) {
      url += `?userId=${userId}`;
    }

    const response = await api.get(url, { params });
    return response.data;
  },

  // Get data access logs
  getDataAccessLogs: async (params = {}) => {
    const response = await api.get(`${AUDIT_LOGS_ENDPOINT}/data-access`, { params });
    return response.data;
  },

  // Get system events
  getSystemEvents: async (params = {}) => {
    const response = await api.get(`${AUDIT_LOGS_ENDPOINT}/system-events`, { params });
    return response.data;
  },

  // Archive old logs
  archiveLogs: async (beforeDate) => {
    const response = await api.post(`${AUDIT_LOGS_ENDPOINT}/archive`, {
      beforeDate,
      archivedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete old logs
  deleteOldLogs: async (beforeDate) => {
    const response = await api.delete(`${AUDIT_LOGS_ENDPOINT}/cleanup`, {
      data: { beforeDate }
    });
    return response.data;
  },

  // Get audit log retention settings
  getRetentionSettings: async () => {
    const response = await api.get(`${AUDIT_LOGS_ENDPOINT}/retention`);
    return response.data;
  },

  // Update audit log retention settings
  updateRetentionSettings: async (settings) => {
    const response = await api.put(`${AUDIT_LOGS_ENDPOINT}/retention`, {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get audit log alerts
  getAlerts: async (params = {}) => {
    const response = await api.get(`${AUDIT_LOGS_ENDPOINT}/alerts`, { params });
    return response.data;
  },

  // Create audit log alert
  createAlert: async (alertData) => {
    const response = await api.post(`${AUDIT_LOGS_ENDPOINT}/alerts`, {
      ...alertData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update alert status
  updateAlertStatus: async (alertId, status) => {
    const response = await api.patch(`${AUDIT_LOGS_ENDPOINT}/alerts/${alertId}`, {
      status,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },
};
