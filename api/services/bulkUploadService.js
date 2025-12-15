import api from './api.js';

const BULK_UPLOAD_ENDPOINT = '/bulkUpload';

export const bulkUploadService = {
  // Get all bulk uploads
  getAll: async (params = {}) => {
    const response = await api.get(BULK_UPLOAD_ENDPOINT, { params });
    return response.data;
  },

  // Get bulk upload by ID
  getById: async (id) => {
    const response = await api.get(`${BULK_UPLOAD_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get uploads by user
  getByUser: async (userId, params = {}) => {
    const response = await api.get(`${BULK_UPLOAD_ENDPOINT}?userId=${userId}`, { params });
    return response.data;
  },

  // Get uploads by status
  getByStatus: async (status, params = {}) => {
    const response = await api.get(`${BULK_UPLOAD_ENDPOINT}?status=${status}`, { params });
    return response.data;
  },

  // Get uploads by module
  getByModule: async (module, params = {}) => {
    const response = await api.get(`${BULK_UPLOAD_ENDPOINT}?module=${module}`, { params });
    return response.data;
  },

  // Create bulk upload
  create: async (uploadData) => {
    const response = await api.post(BULK_UPLOAD_ENDPOINT, {
      ...uploadData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
    });
    return response.data;
  },

  // Upload file for bulk processing
  uploadFile: async (file, module, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('module', module);

    if (options.templateId) formData.append('templateId', options.templateId);
    if (options.validationRules) formData.append('validationRules', JSON.stringify(options.validationRules));
    if (options.mapping) formData.append('mapping', JSON.stringify(options.mapping));

    const response = await api.post(`${BULK_UPLOAD_ENDPOINT}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Start bulk upload processing
  startProcessing: async (id) => {
    const response = await api.post(`${BULK_UPLOAD_ENDPOINT}/${id}/start`, {
      startedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Pause bulk upload
  pauseProcessing: async (id) => {
    const response = await api.post(`${BULK_UPLOAD_ENDPOINT}/${id}/pause`, {
      pausedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Resume bulk upload
  resumeProcessing: async (id) => {
    const response = await api.post(`${BULK_UPLOAD_ENDPOINT}/${id}/resume`, {
      resumedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Cancel bulk upload
  cancelProcessing: async (id) => {
    const response = await api.post(`${BULK_UPLOAD_ENDPOINT}/${id}/cancel`, {
      cancelledAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get upload progress
  getProgress: async (id) => {
    const response = await api.get(`${BULK_UPLOAD_ENDPOINT}/${id}/progress`);
    return response.data;
  },

  // Get upload results
  getResults: async (id, params = {}) => {
    const response = await api.get(`${BULK_UPLOAD_ENDPOINT}/${id}/results`, { params });
    return response.data;
  },

  // Get upload errors
  getErrors: async (id, params = {}) => {
    const response = await api.get(`${BULK_UPLOAD_ENDPOINT}/${id}/errors`, { params });
    return response.data;
  },

  // Get error details
  getErrorDetails: async (id, errorId) => {
    const response = await api.get(`${BULK_UPLOAD_ENDPOINT}/${id}/errors/${errorId}`);
    return response.data;
  },

  // Retry failed records
  retryFailedRecords: async (id, recordIds = null) => {
    const response = await api.post(`${BULK_UPLOAD_ENDPOINT}/${id}/retry`, {
      recordIds,
      retriedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Skip failed records
  skipFailedRecords: async (id, recordIds) => {
    const response = await api.post(`${BULK_UPLOAD_ENDPOINT}/${id}/skip`, {
      recordIds,
      skippedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Download error report
  downloadErrorReport: async (id, format = 'excel') => {
    const response = await api.get(`${BULK_UPLOAD_ENDPOINT}/${id}/errors/download?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Download processed data
  downloadProcessedData: async (id, format = 'excel') => {
    const response = await api.get(`${BULK_UPLOAD_ENDPOINT}/${id}/results/download?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Delete bulk upload
  delete: async (id) => {
    const response = await api.delete(`${BULK_UPLOAD_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get upload templates
  getTemplates: async (module = null) => {
    let url = `${BULK_UPLOAD_ENDPOINT}/templates`;
    if (module) {
      url += `?module=${module}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Create upload template
  createTemplate: async (templateData) => {
    const response = await api.post(`${BULK_UPLOAD_ENDPOINT}/templates`, {
      ...templateData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update upload template
  updateTemplate: async (id, templateData) => {
    const response = await api.put(`${BULK_UPLOAD_ENDPOINT}/templates/${id}`, {
      ...templateData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete upload template
  deleteTemplate: async (id) => {
    const response = await api.delete(`${BULK_UPLOAD_ENDPOINT}/templates/${id}`);
    return response.data;
  },

  // Validate upload file
  validateFile: async (file, module, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('module', module);

    if (options.templateId) formData.append('templateId', options.templateId);
    if (options.validationRules) formData.append('validationRules', JSON.stringify(options.validationRules));

    const response = await api.post(`${BULK_UPLOAD_ENDPOINT}/validate`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get validation results
  getValidationResults: async (validationId) => {
    const response = await api.get(`${BULK_UPLOAD_ENDPOINT}/validation/${validationId}`);
    return response.data;
  },

  // Get bulk upload statistics
  getUploadStats: async (dateRange = null) => {
    let url = `${BULK_UPLOAD_ENDPOINT}/stats`;
    if (dateRange) {
      url += `?startDate=${dateRange.start}&endDate=${dateRange.end}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get user upload history
  getUserUploadHistory: async (userId, params = {}) => {
    const response = await api.get(`${BULK_UPLOAD_ENDPOINT}/history/${userId}`, { params });
    return response.data;
  },

  // Get upload queue
  getUploadQueue: async (params = {}) => {
    const response = await api.get(`${BULK_UPLOAD_ENDPOINT}/queue`, { params });
    return response.data;
  },

  // Reorder upload queue
  reorderQueue: async (uploadIds) => {
    const response = await api.post(`${BULK_UPLOAD_ENDPOINT}/queue/reorder`, {
      uploadIds,
      reorderedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get supported file formats
  getSupportedFormats: async (module = null) => {
    let url = `${BULK_UPLOAD_ENDPOINT}/formats`;
    if (module) {
      url += `?module=${module}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get upload limits
  getUploadLimits: async (module = null) => {
    let url = `${BULK_UPLOAD_ENDPOINT}/limits`;
    if (module) {
      url += `?module=${module}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Bulk operations
  // Bulk delete uploads
  bulkDelete: async (uploadIds) => {
    const response = await api.delete(`${BULK_UPLOAD_ENDPOINT}/bulk`, {
      data: { uploadIds }
    });
    return response.data;
  },

  // Bulk cancel uploads
  bulkCancel: async (uploadIds) => {
    const response = await api.post(`${BULK_UPLOAD_ENDPOINT}/bulk/cancel`, {
      uploadIds,
      cancelledAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Search uploads
  search: async (query, params = {}) => {
    const response = await api.get(`${BULK_UPLOAD_ENDPOINT}?q=${query}`, { params });
    return response.data;
  },

  // Get filtered uploads
  getFilteredUploads: async (filters = {}) => {
    let url = BULK_UPLOAD_ENDPOINT;
    const params = new URLSearchParams();

    if (filters.userId) params.append('userId', filters.userId);
    if (filters.status) params.append('status', filters.status);
    if (filters.module) params.append('module', filters.module);
    if (filters.createdFrom) params.append('createdAt_gte', filters.createdFrom);
    if (filters.createdTo) params.append('createdAt_lte', filters.createdTo);

    params.append('_sort', 'createdAt');
    params.append('_order', 'desc');

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Export uploads
  exportUploads: async (filters = {}, format = 'excel') => {
    let url = `${BULK_UPLOAD_ENDPOINT}/export?format=${format}`;

    const params = new URLSearchParams();
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.status) params.append('status', filters.status);
    if (filters.module) params.append('module', filters.module);

    if (params.toString()) {
      url += `&${params.toString()}`;
    }

    const response = await api.get(url, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Get bulk upload settings
  getUploadSettings: async () => {
    const response = await api.get(`${BULK_UPLOAD_ENDPOINT}/settings`);
    return response.data;
  },

  // Update bulk upload settings
  updateUploadSettings: async (settings) => {
    const response = await api.put(`${BULK_UPLOAD_ENDPOINT}/settings`, {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },
};
