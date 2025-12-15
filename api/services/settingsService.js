import api from './api.js';

const SETTINGS_ENDPOINT = '/settings';

export const settingsService = {
  // Get all settings
  getAll: async () => {
    const response = await api.get(SETTINGS_ENDPOINT);
    return response.data;
  },

  // Get setting by key
  getByKey: async (key) => {
    const response = await api.get(`${SETTINGS_ENDPOINT}/${key}`);
    return response.data;
  },

  // Get settings by category
  getByCategory: async (category) => {
    const response = await api.get(`${SETTINGS_ENDPOINT}?category=${category}`);
    return response.data;
  },

  // Update setting
  update: async (key, value) => {
    const response = await api.put(`${SETTINGS_ENDPOINT}/${key}`, {
      value,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Bulk update settings
  bulkUpdate: async (settings) => {
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updatedAt: new Date().toISOString(),
    }));

    const response = await api.put(`${SETTINGS_ENDPOINT}/bulk`, { updates });
    return response.data;
  },

  // Reset setting to default
  resetToDefault: async (key) => {
    const response = await api.post(`${SETTINGS_ENDPOINT}/${key}/reset`);
    return response.data;
  },

  // Get system configuration
  getSystemConfig: async () => {
    const response = await api.get(`${SETTINGS_ENDPOINT}/system`);
    return response.data;
  },

  // Update system configuration
  updateSystemConfig: async (config) => {
    const response = await api.put(`${SETTINGS_ENDPOINT}/system`, {
      ...config,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get email settings
  getEmailSettings: async () => {
    const response = await api.get(`${SETTINGS_ENDPOINT}/email`);
    return response.data;
  },

  // Update email settings
  updateEmailSettings: async (emailSettings) => {
    const response = await api.put(`${SETTINGS_ENDPOINT}/email`, {
      ...emailSettings,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Test email configuration
  testEmailConfig: async () => {
    const response = await api.post(`${SETTINGS_ENDPOINT}/email/test`);
    return response.data;
  },

  // Get notification settings
  getNotificationSettings: async () => {
    const response = await api.get(`${SETTINGS_ENDPOINT}/notifications`);
    return response.data;
  },

  // Update notification settings
  updateNotificationSettings: async (notificationSettings) => {
    const response = await api.put(`${SETTINGS_ENDPOINT}/notifications`, {
      ...notificationSettings,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get security settings
  getSecuritySettings: async () => {
    const response = await api.get(`${SETTINGS_ENDPOINT}/security`);
    return response.data;
  },

  // Update security settings
  updateSecuritySettings: async (securitySettings) => {
    const response = await api.put(`${SETTINGS_ENDPOINT}/security`, {
      ...securitySettings,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get payroll settings
  getPayrollSettings: async () => {
    const response = await api.get(`${SETTINGS_ENDPOINT}/payroll`);
    return response.data;
  },

  // Update payroll settings
  updatePayrollSettings: async (payrollSettings) => {
    const response = await api.put(`${SETTINGS_ENDPOINT}/payroll`, {
      ...payrollSettings,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get workflow settings
  getWorkflowSettings: async () => {
    const response = await api.get(`${SETTINGS_ENDPOINT}/workflow`);
    return response.data;
  },

  // Update workflow settings
  updateWorkflowSettings: async (workflowSettings) => {
    const response = await api.put(`${SETTINGS_ENDPOINT}/workflow`, {
      ...workflowSettings,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get integration settings
  getIntegrationSettings: async () => {
    const response = await api.get(`${SETTINGS_ENDPOINT}/integrations`);
    return response.data;
  },

  // Update integration settings
  updateIntegrationSettings: async (integrationSettings) => {
    const response = await api.put(`${SETTINGS_ENDPOINT}/integrations`, {
      ...integrationSettings,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Test integration connection
  testIntegrationConnection: async (integrationType) => {
    const response = await api.post(`${SETTINGS_ENDPOINT}/integrations/${integrationType}/test`);
    return response.data;
  },

  // Get audit settings
  getAuditSettings: async () => {
    const response = await api.get(`${SETTINGS_ENDPOINT}/audit`);
    return response.data;
  },

  // Update audit settings
  updateAuditSettings: async (auditSettings) => {
    const response = await api.put(`${SETTINGS_ENDPOINT}/audit`, {
      ...auditSettings,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get backup settings
  getBackupSettings: async () => {
    const response = await api.get(`${SETTINGS_ENDPOINT}/backup`);
    return response.data;
  },

  // Update backup settings
  updateBackupSettings: async (backupSettings) => {
    const response = await api.put(`${SETTINGS_ENDPOINT}/backup`, {
      ...backupSettings,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Trigger manual backup
  triggerBackup: async () => {
    const response = await api.post(`${SETTINGS_ENDPOINT}/backup/trigger`);
    return response.data;
  },

  // Get maintenance settings
  getMaintenanceSettings: async () => {
    const response = await api.get(`${SETTINGS_ENDPOINT}/maintenance`);
    return response.data;
  },

  // Update maintenance settings
  updateMaintenanceSettings: async (maintenanceSettings) => {
    const response = await api.put(`${SETTINGS_ENDPOINT}/maintenance`, {
      ...maintenanceSettings,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get settings history
  getSettingsHistory: async (key = null, params = {}) => {
    let url = `${SETTINGS_ENDPOINT}/history`;
    if (key) {
      url += `/${key}`;
    }

    const response = await api.get(url, { params });
    return response.data;
  },

  // Export settings
  exportSettings: async () => {
    const response = await api.get(`${SETTINGS_ENDPOINT}/export`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Import settings
  importSettings: async (settingsFile) => {
    const formData = new FormData();
    formData.append('settings', settingsFile);

    const response = await api.post(`${SETTINGS_ENDPOINT}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
