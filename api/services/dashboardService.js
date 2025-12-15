import api from './api.js';

const DASHBOARD_ENDPOINT = '/dashboard';

export const dashboardService = {
  // Get main dashboard data
  getDashboardData: async () => {
    const response = await api.get(DASHBOARD_ENDPOINT);
    return response.data;
  },

  // Get dashboard metrics
  getDashboardMetrics: async () => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/metrics`);
    return response.data;
  },

  // Get dashboard charts data
  getDashboardCharts: async () => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/charts`);
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async (limit = 10) => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/activities?limit=${limit}`);
    return response.data;
  },

  // Get pending tasks
  getPendingTasks: async () => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/pending-tasks`);
    return response.data;
  },

  // Get notifications
  getNotifications: async (params = {}) => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/notifications`, { params });
    return response.data;
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    const response = await api.patch(`${DASHBOARD_ENDPOINT}/notifications/${notificationId}`, {
      isRead: true,
      readAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async () => {
    const response = await api.patch(`${DASHBOARD_ENDPOINT}/notifications/mark-all-read`, {
      readAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get dashboard widgets
  getDashboardWidgets: async () => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/widgets`);
    return response.data;
  },

  // Update dashboard widget
  updateDashboardWidget: async (widgetId, widgetData) => {
    const response = await api.put(`${DASHBOARD_ENDPOINT}/widgets/${widgetId}`, widgetData);
    return response.data;
  },

  // Get quick stats
  getQuickStats: async () => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/quick-stats`);
    return response.data;
  },

  // Get alerts and warnings
  getAlerts: async () => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/alerts`);
    return response.data;
  },

  // Dismiss alert
  dismissAlert: async (alertId) => {
    const response = await api.patch(`${DASHBOARD_ENDPOINT}/alerts/${alertId}`, {
      dismissed: true,
      dismissedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get system health status
  getSystemHealth: async () => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/system-health`);
    return response.data;
  },

  // Get performance metrics
  getPerformanceMetrics: async (timeRange = '24h') => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/performance?timeRange=${timeRange}`);
    return response.data;
  },

  // Get user activity summary
  getUserActivitySummary: async (timeRange = '7d') => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/user-activity?timeRange=${timeRange}`);
    return response.data;
  },

  // Get workflow summary
  getWorkflowSummary: async () => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/workflow-summary`);
    return response.data;
  },

  // Get payroll summary
  getPayrollSummary: async () => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/payroll-summary`);
    return response.data;
  },

  // Get attendance summary
  getAttendanceSummary: async (month = null) => {
    let url = `${DASHBOARD_ENDPOINT}/attendance-summary`;
    if (month) {
      url += `?month=${month}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get leave summary
  getLeaveSummary: async (year = null) => {
    let url = `${DASHBOARD_ENDPOINT}/leave-summary`;
    if (year) {
      url += `?year=${year}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get reimbursement summary
  getReimbursementSummary: async (month = null) => {
    let url = `${DASHBOARD_ENDPOINT}/reimbursement-summary`;
    if (month) {
      url += `?month=${month}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get team performance summary
  getTeamPerformanceSummary: async () => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/team-performance`);
    return response.data;
  },

  // Get custom dashboard data
  getCustomDashboardData: async (dashboardId) => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/custom/${dashboardId}`);
    return response.data;
  },

  // Save custom dashboard
  saveCustomDashboard: async (dashboardData) => {
    const response = await api.post(`${DASHBOARD_ENDPOINT}/custom`, {
      ...dashboardData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update custom dashboard
  updateCustomDashboard: async (dashboardId, dashboardData) => {
    const response = await api.put(`${DASHBOARD_ENDPOINT}/custom/${dashboardId}`, {
      ...dashboardData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete custom dashboard
  deleteCustomDashboard: async (dashboardId) => {
    const response = await api.delete(`${DASHBOARD_ENDPOINT}/custom/${dashboardId}`);
    return response.data;
  },

  // Get dashboard templates
  getDashboardTemplates: async () => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/templates`);
    return response.data;
  },

  // Export dashboard data
  exportDashboardData: async (format = 'excel') => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Get dashboard settings
  getDashboardSettings: async () => {
    const response = await api.get(`${DASHBOARD_ENDPOINT}/settings`);
    return response.data;
  },

  // Update dashboard settings
  updateDashboardSettings: async (settings) => {
    const response = await api.put(`${DASHBOARD_ENDPOINT}/settings`, {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Reset dashboard to default
  resetDashboardToDefault: async () => {
    const response = await api.post(`${DASHBOARD_ENDPOINT}/reset`);
    return response.data;
  },
};
