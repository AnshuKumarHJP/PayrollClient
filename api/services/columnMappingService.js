import api from './api.js';

const COLUMN_MAPPING_ENDPOINT = '/columnMapping';

export const columnMappingService = {
  // Get all column mappings
  getAll: async (params = {}) => {
    const response = await api.get(COLUMN_MAPPING_ENDPOINT, { params });
    return response.data;
  },

  // Get column mapping by ID
  getById: async (id) => {
    const response = await api.get(`${COLUMN_MAPPING_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get mappings by template
  getByTemplate: async (templateId, params = {}) => {
    const response = await api.get(`${COLUMN_MAPPING_ENDPOINT}?templateId=${templateId}`, { params });
    return response.data;
  },

  // Get mappings by module
  getByModule: async (module, params = {}) => {
    const response = await api.get(`${COLUMN_MAPPING_ENDPOINT}?module=${module}`, { params });
    return response.data;
  },

  // Create column mapping
  create: async (mappingData) => {
    const response = await api.post(COLUMN_MAPPING_ENDPOINT, {
      ...mappingData,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    });
    return response.data;
  },

  // Update column mapping
  update: async (id, mappingData) => {
    const response = await api.put(`${COLUMN_MAPPING_ENDPOINT}/${id}`, {
      ...mappingData,
      lastModified: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete column mapping
  delete: async (id) => {
    const response = await api.delete(`${COLUMN_MAPPING_ENDPOINT}/${id}`);
    return response.data;
  },

  // Auto-map columns
  autoMapColumns: async (fileData, templateId) => {
    const response = await api.post(`${COLUMN_MAPPING_ENDPOINT}/auto-map`, {
      fileData,
      templateId,
      mappedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Validate column mapping
  validateMapping: async (mappingId) => {
    const response = await api.post(`${COLUMN_MAPPING_ENDPOINT}/${mappingId}/validate`);
    return response.data;
  },

  // Preview mapped data
  previewMappedData: async (mappingId, sampleData = null) => {
    const response = await api.post(`${COLUMN_MAPPING_ENDPOINT}/${mappingId}/preview`, {
      sampleData,
      previewedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get mapping suggestions
  getMappingSuggestions: async (fileHeaders, templateFields) => {
    const response = await api.post(`${COLUMN_MAPPING_ENDPOINT}/suggestions`, {
      fileHeaders,
      templateFields,
    });
    return response.data;
  },

  // Save mapping as template
  saveAsTemplate: async (mappingId, templateName) => {
    const response = await api.post(`${COLUMN_MAPPING_ENDPOINT}/${mappingId}/save-template`, {
      templateName,
      savedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get mapping templates
  getMappingTemplates: async (module = null) => {
    let url = `${COLUMN_MAPPING_ENDPOINT}/templates`;
    if (module) {
      url += `?module=${module}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Apply mapping template
  applyMappingTemplate: async (templateId, fileData) => {
    const response = await api.post(`${COLUMN_MAPPING_ENDPOINT}/templates/${templateId}/apply`, {
      fileData,
      appliedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get mapping history
  getMappingHistory: async (id) => {
    const response = await api.get(`${COLUMN_MAPPING_ENDPOINT}/${id}/history`);
    return response.data;
  },

  // Clone mapping
  cloneMapping: async (id, newName = null) => {
    const response = await api.post(`${COLUMN_MAPPING_ENDPOINT}/${id}/clone`, {
      newName,
      clonedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get mapping statistics
  getMappingStats: async (id) => {
    const response = await api.get(`${COLUMN_MAPPING_ENDPOINT}/${id}/stats`);
    return response.data;
  },

  // Bulk operations
  // Bulk create mappings
  bulkCreate: async (mappings) => {
    const mappingsWithTimestamps = mappings.map(mapping => ({
      ...mapping,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    }));

    const response = await api.post(`${COLUMN_MAPPING_ENDPOINT}/bulk`, mappingsWithTimestamps);
    return response.data;
  },

  // Bulk update mappings
  bulkUpdate: async (updates) => {
    const updatesWithTimestamps = updates.map(update => ({
      ...update,
      lastModified: new Date().toISOString(),
    }));

    const response = await api.put(`${COLUMN_MAPPING_ENDPOINT}/bulk`, { updates: updatesWithTimestamps });
    return response.data;
  },

  // Bulk delete mappings
  bulkDelete: async (ids) => {
    const response = await api.delete(`${COLUMN_MAPPING_ENDPOINT}/bulk`, {
      data: { ids }
    });
    return response.data;
  },

  // Export mapping
  exportMapping: async (id, format = 'json') => {
    const response = await api.get(`${COLUMN_MAPPING_ENDPOINT}/${id}/export?format=${format}`, {
      responseType: format === 'json' ? 'json' : 'blob'
    });
    return response.data;
  },

  // Import mapping
  importMapping: async (mappingFile) => {
    const formData = new FormData();
    formData.append('mapping', mappingFile);

    const response = await api.post(`${COLUMN_MAPPING_ENDPOINT}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get mapping conflicts
  getMappingConflicts: async (mappingId) => {
    const response = await api.get(`${COLUMN_MAPPING_ENDPOINT}/${mappingId}/conflicts`);
    return response.data;
  },

  // Resolve mapping conflict
  resolveConflict: async (mappingId, conflictId, resolution) => {
    const response = await api.post(`${COLUMN_MAPPING_ENDPOINT}/${mappingId}/conflicts/${conflictId}/resolve`, {
      resolution,
      resolvedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get data transformation rules
  getTransformationRules: async () => {
    const response = await api.get(`${COLUMN_MAPPING_ENDPOINT}/transformation-rules`);
    return response.data;
  },

  // Create transformation rule
  createTransformationRule: async (ruleData) => {
    const response = await api.post(`${COLUMN_MAPPING_ENDPOINT}/transformation-rules`, {
      ...ruleData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update transformation rule
  updateTransformationRule: async (id, ruleData) => {
    const response = await api.put(`${COLUMN_MAPPING_ENDPOINT}/transformation-rules/${id}`, {
      ...ruleData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete transformation rule
  deleteTransformationRule: async (id) => {
    const response = await api.delete(`${COLUMN_MAPPING_ENDPOINT}/transformation-rules/${id}`);
    return response.data;
  },

  // Apply transformation rule
  applyTransformationRule: async (mappingId, ruleId) => {
    const response = await api.post(`${COLUMN_MAPPING_ENDPOINT}/${mappingId}/apply-rule`, {
      ruleId,
      appliedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get mapping validation rules
  getValidationRules: async () => {
    const response = await api.get(`${COLUMN_MAPPING_ENDPOINT}/validation-rules`);
    return response.data;
  },

  // Create validation rule
  createValidationRule: async (ruleData) => {
    const response = await api.post(`${COLUMN_MAPPING_ENDPOINT}/validation-rules`, {
      ...ruleData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update validation rule
  updateValidationRule: async (id, ruleData) => {
    const response = await api.put(`${COLUMN_MAPPING_ENDPOINT}/validation-rules/${id}`, {
      ...ruleData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete validation rule
  deleteValidationRule: async (id) => {
    const response = await api.delete(`${COLUMN_MAPPING_ENDPOINT}/validation-rules/${id}`);
    return response.data;
  },

  // Validate data against rules
  validateData: async (mappingId, data) => {
    const response = await api.post(`${COLUMN_MAPPING_ENDPOINT}/${mappingId}/validate-data`, {
      data,
      validatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get mapping analytics
  getMappingAnalytics: async (id, dateRange = null) => {
    let url = `${COLUMN_MAPPING_ENDPOINT}/${id}/analytics`;

    if (dateRange) {
      url += `?startDate=${dateRange.start}&endDate=${dateRange.end}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get popular mappings
  getPopularMappings: async (limit = 10) => {
    const response = await api.get(`${COLUMN_MAPPING_ENDPOINT}/popular?limit=${limit}`);
    return response.data;
  },

  // Get recently used mappings
  getRecentlyUsed: async (limit = 10) => {
    const response = await api.get(`${COLUMN_MAPPING_ENDPOINT}/recent?limit=${limit}`);
    return response.data;
  },

  // Search mappings
  search: async (query, params = {}) => {
    const response = await api.get(`${COLUMN_MAPPING_ENDPOINT}?q=${query}`, { params });
    return response.data;
  },

  // Get filtered mappings
  getFilteredMappings: async (filters = {}) => {
    let url = COLUMN_MAPPING_ENDPOINT;
    const params = new URLSearchParams();

    if (filters.templateId) params.append('templateId', filters.templateId);
    if (filters.module) params.append('module', filters.module);
    if (filters.createdBy) params.append('createdBy', filters.createdBy);
    if (filters.createdFrom) params.append('createdAt_gte', filters.createdFrom);
    if (filters.createdTo) params.append('createdAt_lte', filters.createdTo);

    params.append('_sort', 'lastModified');
    params.append('_order', 'desc');

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get mapping settings
  getMappingSettings: async () => {
    const response = await api.get(`${COLUMN_MAPPING_ENDPOINT}/settings`);
    return response.data;
  },

  // Update mapping settings
  updateMappingSettings: async (settings) => {
    const response = await api.put(`${COLUMN_MAPPING_ENDPOINT}/settings`, {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },
};
