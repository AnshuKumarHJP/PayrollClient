import api from './api.js';

const TEMPLATES_ENDPOINT = '/templates';

export const templateService = {
  // Get all templates
  getAll: async (params = {}) => {
    const response = await api.get(TEMPLATES_ENDPOINT, { params });
    return response.data;
  },

  // Get template by ID
  getById: async (id) => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get templates by module
  getByModule: async (module, params = {}) => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}?module=${module}`, { params });
    return response.data;
  },

  // Get templates by status
  getByStatus: async (status, params = {}) => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}?status=${status}`, { params });
    return response.data;
  },

  // Get templates by creator
  getByCreator: async (creatorId, params = {}) => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}?createdBy=${creatorId}`, { params });
    return response.data;
  },

  // Create template
  create: async (templateData) => {
    const response = await api.post(TEMPLATES_ENDPOINT, {
      ...templateData,
      status: templateData.status || 'draft',
      version: templateData.version || '1.0',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    });
    return response.data;
  },

  // Update template
  update: async (id, templateData) => {
    const response = await api.put(`${TEMPLATES_ENDPOINT}/${id}`, {
      id,
      ...templateData,
      lastModified: new Date().toISOString(),
    });

    return response.data;
  },
  // Update template status
  updateStatus: async (id, status) => {
    const response = await api.patch(`${TEMPLATES_ENDPOINT}/${id}`, {
      status,
      lastModified: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete template
  delete: async (id) => {
    const response = await api.delete(`${TEMPLATES_ENDPOINT}/${id}`);
    return response.data;
  },

  // Duplicate template
  duplicate: async (id, newName = null) => {
    const response = await api.post(`${TEMPLATES_ENDPOINT}/${id}/duplicate`, {
      newName,
      duplicatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get template versions
  getVersions: async (id) => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}/${id}/versions`);
    return response.data;
  },

  // Create new version
  createVersion: async (id, versionData) => {
    const response = await api.post(`${TEMPLATES_ENDPOINT}/${id}/versions`, {
      ...versionData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get template fields
  getFields: async (id) => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}/${id}/fields`);
    return response.data;
  },

  // Update template fields
  updateFields: async (id, fields) => {
    const response = await api.put(`${TEMPLATES_ENDPOINT}/${id}/fields`, {
      fields,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Validate template
  validate: async (id) => {
    const response = await api.post(`${TEMPLATES_ENDPOINT}/${id}/validate`);
    return response.data;
  },

  // Preview template
  preview: async (id, data = {}) => {
    // Get the template first
    const template = await templateService.getById(id);

    // Clean template fields to remove validation objects that could cause rendering issues
    const cleanTemplate = {
      ...template,
      fields: template.fields.map(field => {
        const { validation, ...cleanField } = field;
        return cleanField;
      })
    };

    // Generate mock preview data based on template fields
    const mockData = [];
    const sampleCount = data.sampleCount || 5;

    for (let i = 0; i < sampleCount; i++) {
      const row = {};
      cleanTemplate.fields.forEach(field => {
        switch (field.type) {
          case 'text':
            row[field.name] = `${field.label} ${i + 1}`;
            break;
          case 'email':
            row[field.name] = `user${i + 1}@example.com`;
            break;
          case 'number':
            row[field.name] = Math.floor(Math.random() * 10000) + 1000;
            break;
          case 'date':
            const date = new Date();
            date.setDate(date.getDate() + i);
            row[field.name] = date.toISOString().split('T')[0];
            break;
          case 'select':
            row[field.name] = field.options ? field.options[0] : 'Option 1';
            break;
          case 'textarea':
            row[field.name] = `Sample ${field.label.toLowerCase()} content for row ${i + 1}`;
            break;
          default:
            row[field.name] = `Sample ${field.label}`;
        }
      });
      mockData.push(row);
    }

    return {
      data: mockData,
      template: cleanTemplate,
      totalRows: mockData.length,
      generatedAt: new Date().toISOString()
    };
  },

  // Export template
  export: async (id, format = 'json') => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}/${id}/export?format=${format}`, {
      responseType: format === 'json' ? 'json' : 'blob'
    });
    return response.data;
  },

  // Import template
  import: async (templateFile) => {
    const formData = new FormData();
    formData.append('template', templateFile);

    const response = await api.post(`${TEMPLATES_ENDPOINT}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get template usage statistics
  getUsageStats: async (id) => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}/${id}/usage-stats`);
    return response.data;
  },

  // Get template categories
  getCategories: async () => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}/categories`);
    return response.data;
  },

  // Create template category
  createCategory: async (categoryData) => {
    const response = await api.post(`${TEMPLATES_ENDPOINT}/categories`, {
      ...categoryData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get template tags
  getTags: async () => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}/tags`);
    return response.data;
  },

  // Add tag to template
  addTag: async (id, tag) => {
    const response = await api.post(`${TEMPLATES_ENDPOINT}/${id}/tags`, {
      tag,
      addedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Remove tag from template
  removeTag: async (id, tagId) => {
    const response = await api.delete(`${TEMPLATES_ENDPOINT}/${id}/tags/${tagId}`);
    return response.data;
  },

  // Search templates
  search: async (query, params = {}) => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}?q=${query}`, { params });
    return response.data;
  },

  // Get filtered templates
  getFilteredTemplates: async (filters = {}) => {
    let url = TEMPLATES_ENDPOINT;
    const params = new URLSearchParams();

    if (filters.module) params.append('module', filters.module);
    if (filters.status) params.append('status', filters.status);
    if (filters.createdBy) params.append('createdBy', filters.createdBy);
    if (filters.category) params.append('category', filters.category);
    if (filters.tags) params.append('tags', filters.tags);
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

  // Get template statistics
  getTemplateStats: async () => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}/stats`);
    return response.data;
  },

  // Get popular templates
  getPopularTemplates: async (limit = 10) => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}/popular?limit=${limit}`);
    return response.data;
  },

  // Get recently used templates
  getRecentlyUsed: async (limit = 10) => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}/recent?limit=${limit}`);
    return response.data;
  },

  // Bulk operations
  // Bulk update template status
  bulkUpdateStatus: async (templateIds, status) => {
    const response = await api.patch(`${TEMPLATES_ENDPOINT}/bulk/status`, {
      templateIds,
      status,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Bulk delete templates
  bulkDelete: async (templateIds) => {
    const response = await api.delete(`${TEMPLATES_ENDPOINT}/bulk`, {
      data: { templateIds }
    });
    return response.data;
  },

  // Bulk export templates
  bulkExport: async (templateIds, format = 'json') => {
    const response = await api.post(`${TEMPLATES_ENDPOINT}/bulk/export`, {
      templateIds,
      format,
    }, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Template sharing
  // Share template with user
  shareWithUser: async (id, userId, permissions = 'read') => {
    const response = await api.post(`${TEMPLATES_ENDPOINT}/${id}/share`, {
      userId,
      permissions,
      sharedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Share template with team
  shareWithTeam: async (id, teamId, permissions = 'read') => {
    const response = await api.post(`${TEMPLATES_ENDPOINT}/${id}/share-team`, {
      teamId,
      permissions,
      sharedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get shared templates
  getSharedTemplates: async (params = {}) => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}/shared`, { params });
    return response.data;
  },

  // Remove sharing
  removeSharing: async (id, shareId) => {
    const response = await api.delete(`${TEMPLATES_ENDPOINT}/${id}/share/${shareId}`);
    return response.data;
  },

  // Template comments
  // Get template comments
  getComments: async (id) => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}/${id}/comments`);
    return response.data;
  },

  // Add comment to template
  addComment: async (id, commentData) => {
    const response = await api.post(`${TEMPLATES_ENDPOINT}/${id}/comments`, {
      ...commentData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update comment
  updateComment: async (id, commentId, commentData) => {
    const response = await api.put(`${TEMPLATES_ENDPOINT}/${id}/comments/${commentId}`, {
      ...commentData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete comment
  deleteComment: async (id, commentId) => {
    const response = await api.delete(`${TEMPLATES_ENDPOINT}/${id}/comments/${commentId}`);
    return response.data;
  },

  // Template history
  // Get template change history
  getChangeHistory: async (id, params = {}) => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}/${id}/history`, { params });
    return response.data;
  },

  // Revert template to version
  revertToVersion: async (id, versionId) => {
    const response = await api.post(`${TEMPLATES_ENDPOINT}/${id}/revert`, {
      versionId,
      revertedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Template settings
  // Get template settings
  getSettings: async () => {
    const response = await api.get(`${TEMPLATES_ENDPOINT}/settings`);
    return response.data;
  },

  // Update template settings
  updateSettings: async (settings) => {
    const response = await api.put(`${TEMPLATES_ENDPOINT}/settings`, {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  }
};
