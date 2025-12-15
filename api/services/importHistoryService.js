import api from './api.js';

const IMPORT_HISTORY_ENDPOINT = '/importHistory';

export const importHistoryService = {
  // Get all import history records
  getAll: async (params = {}) => {
    const response = await api.get(IMPORT_HISTORY_ENDPOINT, { params });
    return response.data;
  },

  // Get import history by ID
  getById: async (id) => {
    const response = await api.get(`${IMPORT_HISTORY_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get import history by module
  getByModule: async (module, params = {}) => {
    const response = await api.get(`${IMPORT_HISTORY_ENDPOINT}?module=${module}`, { params });
    return response.data;
  },

  // Get import history by user
  getByUser: async (userId, params = {}) => {
    const response = await api.get(`${IMPORT_HISTORY_ENDPOINT}?uploadedBy=${userId}`, { params });
    return response.data;
  },

  // Create import history record
  create: async (historyData) => {
    const response = await api.post(IMPORT_HISTORY_ENDPOINT, {
      ...historyData,
      uploadedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update import history
  update: async (id, historyData) => {
    const response = await api.put(`${IMPORT_HISTORY_ENDPOINT}/${id}`, historyData);
    return response.data;
  },

  // Delete import history
  delete: async (id) => {
    const response = await api.delete(`${IMPORT_HISTORY_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get import statistics
  getImportStats: async (dateRange = null, module = null) => {
    let url = `${IMPORT_HISTORY_ENDPOINT}?_sort=uploadedAt&_order=desc`;

    if (module) {
      url += `&module=${module}`;
    }

    if (dateRange) {
      url += `&uploadedAt_gte=${dateRange.start}&uploadedAt_lte=${dateRange.end}`;
    }

    const history = await api.get(url).then(res => res.data);

    const stats = {
      totalImports: history.length,
      successfulImports: history.filter(h => h.status === 'completed').length,
      failedImports: history.filter(h => h.status === 'failed').length,
      importsWithErrors: history.filter(h => h.status === 'completed_with_errors').length,
      totalRecordsProcessed: history.reduce((sum, h) => sum + (h.totalRecords || 0), 0),
      totalErrors: history.reduce((sum, h) => sum + (h.errorCount || 0), 0),
      recentImports: history.slice(0, 10),
    };

    return stats;
  },

  // Get import history with filtering
  getFilteredHistory: async (filters = {}) => {
    let url = IMPORT_HISTORY_ENDPOINT;
    const params = new URLSearchParams();

    if (filters.module) params.append('module', filters.module);
    if (filters.status) params.append('status', filters.status);
    if (filters.uploadedBy) params.append('uploadedBy', filters.uploadedBy);
    if (filters.startDate) params.append('uploadedAt_gte', filters.startDate);
    if (filters.endDate) params.append('uploadedAt_lte', filters.endDate);

    params.append('_sort', 'uploadedAt');
    params.append('_order', 'desc');

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Download import file
  downloadImportFile: async (id) => {
    const response = await api.get(`${IMPORT_HISTORY_ENDPOINT}/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Get import details with errors
  getImportDetails: async (id) => {
    const [history, errors] = await Promise.all([
      importHistoryService.getById(id),
      api.get(`/validationErrors?uploadId=${id}`)
    ]);

    return {
      ...history,
      errors: errors.data,
    };
  },
};
