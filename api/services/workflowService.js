import api from './api.js';

const WORKFLOWS_ENDPOINT = '/workflows';
const WORKFLOW_TASKS_ENDPOINT = '/tasks';
const WORKFLOW_STAGES_ENDPOINT = '/workflowStages';

export const workflowService = {
  // Workflows Management
  // Get all workflows
  getAllWorkflows: async (params = {}) => {
    const response = await api.get(WORKFLOWS_ENDPOINT, { params });
    return response.data;
  },

  // Get workflow by ID
  getWorkflowById: async (id) => {
    const response = await api.get(`${WORKFLOWS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get workflows by module
  getWorkflowsByModule: async (module, params = {}) => {
    const response = await api.get(`${WORKFLOWS_ENDPOINT}?module=${module}`, { params });
    return response.data;
  },

  // Get workflows by status
  getWorkflowsByStatus: async (status, params = {}) => {
    const response = await api.get(`${WORKFLOWS_ENDPOINT}?status=${status}`, { params });
    return response.data;
  },

  // Create workflow
  createWorkflow: async (workflowData) => {
    const response = await api.post(WORKFLOWS_ENDPOINT, {
      ...workflowData,
      status: workflowData.status || 'draft',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    });
    return response.data;
  },

  // Update workflow
  updateWorkflow: async (id, workflowData) => {
    const response = await api.put(`${WORKFLOWS_ENDPOINT}/${id}`, {
      ...workflowData,
      lastModified: new Date().toISOString(),
    });
    return response.data;
  },

  // Update workflow status
  updateWorkflowStatus: async (id, status) => {
    const response = await api.patch(`${WORKFLOWS_ENDPOINT}/${id}`, {
      status,
      lastModified: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete workflow
  deleteWorkflow: async (id) => {
    const response = await api.delete(`${WORKFLOWS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Duplicate workflow
  duplicateWorkflow: async (id, newName = null) => {
    const response = await api.post(`${WORKFLOWS_ENDPOINT}/${id}/duplicate`, {
      newName,
      duplicatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get workflow stages
  getWorkflowStages: async (id) => {
    const response = await api.get(`${WORKFLOWS_ENDPOINT}/${id}/stages`);
    return response.data;
  },

  // Update workflow stages
  updateWorkflowStages: async (id, stages) => {
    const response = await api.put(`${WORKFLOWS_ENDPOINT}/${id}/stages`, {
      stages,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Workflow Tasks Management
  // Get all workflow tasks
  getAllTasks: async (params = {}) => {
    const response = await api.get(WORKFLOW_TASKS_ENDPOINT, { params });
    return response.data;
  },

  // Get task by ID
  getTaskById: async (id) => {
    const response = await api.get(`${WORKFLOW_TASKS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get tasks by workflow
  getTasksByWorkflow: async (workflowId, params = {}) => {
    const response = await api.get(`${WORKFLOW_TASKS_ENDPOINT}?workflowId=${workflowId}`, { params });
    return response.data;
  },

  // Get tasks by assignee
  getTasksByAssignee: async (assigneeId, params = {}) => {
    const response = await api.get(`${WORKFLOW_TASKS_ENDPOINT}?assigneeId=${assigneeId}`, { params });
    return response.data;
  },

  // Get tasks by status
  getTasksByStatus: async (status, params = {}) => {
    const response = await api.get(`${WORKFLOW_TASKS_ENDPOINT}?status=${status}`, { params });
    return response.data;
  },

  // Get tasks by priority
  getTasksByPriority: async (priority, params = {}) => {
    const response = await api.get(`${WORKFLOW_TASKS_ENDPOINT}?priority=${priority}`, { params });
    return response.data;
  },

  // Get unclaimed tasks
  getUnclaimedTasks: async (params = {}) => {
    const response = await api.get(`${WORKFLOW_TASKS_ENDPOINT}/unclaimed`, { params });
    return response.data;
  },

  // Get pending tasks
  getPendingTasks: async (assigneeId = null, params = {}) => {
    let url = `${WORKFLOW_TASKS_ENDPOINT}/pending`;
    if (assigneeId) {
      url += `?assigneeId=${assigneeId}`;
    }

    const response = await api.get(url, { params });
    return response.data;
  },

  // Create workflow task
  createTask: async (taskData) => {
    const response = await api.post(WORKFLOW_TASKS_ENDPOINT, {
      ...taskData,
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update workflow task
  updateTask: async (id, taskData) => {
    const response = await api.put(`${WORKFLOW_TASKS_ENDPOINT}/${id}`, {
      ...taskData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update task status
  updateTaskStatus: async (id, status, comments = null) => {
    const response = await api.patch(`${WORKFLOW_TASKS_ENDPOINT}/${id}`, {
      status,
      comments,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Assign task to user
  assignTask: async (id, assigneeId) => {
    const response = await api.patch(`${WORKFLOW_TASKS_ENDPOINT}/${id}/assign`, {
      assigneeId,
      assignedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Claim task
  claimTask: async (id) => {
    const response = await api.patch(`${WORKFLOW_TASKS_ENDPOINT}/${id}/claim`, {
      claimedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Approve task
  approveTask: async (id, approvalData) => {
    const response = await api.patch(`${WORKFLOW_TASKS_ENDPOINT}/${id}/approve`, {
      ...approvalData,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Reject task
  rejectTask: async (id, rejectionData) => {
    const response = await api.patch(`${WORKFLOW_TASKS_ENDPOINT}/${id}/reject`, {
      ...rejectionData,
      rejectedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete workflow task
  deleteTask: async (id) => {
    const response = await api.delete(`${WORKFLOW_TASKS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get task comments
  getTaskComments: async (id) => {
    const response = await api.get(`${WORKFLOW_TASKS_ENDPOINT}/${id}/comments`);
    return response.data;
  },

  // Add task comment
  addTaskComment: async (id, commentData) => {
    const response = await api.post(`${WORKFLOW_TASKS_ENDPOINT}/${id}/comments`, {
      ...commentData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get task attachments
  getTaskAttachments: async (id) => {
    const response = await api.get(`${WORKFLOW_TASKS_ENDPOINT}/${id}/attachments`);
    return response.data;
  },

  // Upload task attachment
  uploadTaskAttachment: async (id, attachmentFile, attachmentType) => {
    const formData = new FormData();
    formData.append('attachment', attachmentFile);
    formData.append('attachmentType', attachmentType);

    const response = await api.post(`${WORKFLOW_TASKS_ENDPOINT}/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download task attachment
  downloadTaskAttachment: async (id, attachmentId) => {
    const response = await api.get(`${WORKFLOW_TASKS_ENDPOINT}/${id}/attachments/${attachmentId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Delete task attachment
  deleteTaskAttachment: async (id, attachmentId) => {
    const response = await api.delete(`${WORKFLOW_TASKS_ENDPOINT}/${id}/attachments/${attachmentId}`);
    return response.data;
  },

  // Get task history
  getTaskHistory: async (id) => {
    const response = await api.get(`${WORKFLOW_TASKS_ENDPOINT}/${id}/history`);
    return response.data;
  },

  // Workflow Stages Management
  // Get all workflow stages
  getAllStages: async (params = {}) => {
    const response = await api.get(WORKFLOW_STAGES_ENDPOINT, { params });
    return response.data;
  },

  // Get stage by ID
  getStageById: async (id) => {
    const response = await api.get(`${WORKFLOW_STAGES_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get stages by workflow
  getStagesByWorkflow: async (workflowId) => {
    const response = await api.get(`${WORKFLOW_STAGES_ENDPOINT}?workflowId=${workflowId}`);
    return response.data;
  },

  // Create workflow stage
  createStage: async (stageData) => {
    const response = await api.post(WORKFLOW_STAGES_ENDPOINT, {
      ...stageData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update workflow stage
  updateStage: async (id, stageData) => {
    const response = await api.put(`${WORKFLOW_STAGES_ENDPOINT}/${id}`, {
      ...stageData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete workflow stage
  deleteStage: async (id) => {
    const response = await api.delete(`${WORKFLOW_STAGES_ENDPOINT}/${id}`);
    return response.data;
  },

  // Reorder workflow stages
  reorderStages: async (workflowId, stageOrder) => {
    const response = await api.patch(`${WORKFLOW_STAGES_ENDPOINT}/reorder`, {
      workflowId,
      stageOrder,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Dashboard and Analytics
  // Get workflow dashboard data
  getWorkflowDashboard: async () => {
    const response = await api.get(`${WORKFLOWS_ENDPOINT}/dashboard`);
    return response.data;
  },

  // Get workflow statistics
  getWorkflowStats: async (dateRange = null) => {
    let url = `${WORKFLOWS_ENDPOINT}/stats`;
    if (dateRange) {
      url += `?startDate=${dateRange.start}&endDate=${dateRange.end}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get task statistics
  getTaskStats: async (dateRange = null) => {
    let url = `${WORKFLOW_TASKS_ENDPOINT}/stats`;
    if (dateRange) {
      url += `?startDate=${dateRange.start}&endDate=${dateRange.end}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get user workload
  getUserWorkload: async (userId = null) => {
    let url = `${WORKFLOW_TASKS_ENDPOINT}/workload`;
    if (userId) {
      url += `?userId=${userId}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get overdue tasks
  getOverdueTasks: async (params = {}) => {
    const response = await api.get(`${WORKFLOW_TASKS_ENDPOINT}/overdue`, { params });
    return response.data;
  },

  // Get tasks due today
  getTasksDueToday: async (assigneeId = null) => {
    let url = `${WORKFLOW_TASKS_ENDPOINT}/due-today`;
    if (assigneeId) {
      url += `?assigneeId=${assigneeId}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get tasks due this week
  getTasksDueThisWeek: async (assigneeId = null) => {
    let url = `${WORKFLOW_TASKS_ENDPOINT}/due-this-week`;
    if (assigneeId) {
      url += `?assigneeId=${assigneeId}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Bulk operations
  // Bulk update task status
  bulkUpdateTaskStatus: async (taskIds, status, comments = null) => {
    const response = await api.patch(`${WORKFLOW_TASKS_ENDPOINT}/bulk/status`, {
      taskIds,
      status,
      comments,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Bulk assign tasks
  bulkAssignTasks: async (taskIds, assigneeId) => {
    const response = await api.patch(`${WORKFLOW_TASKS_ENDPOINT}/bulk/assign`, {
      taskIds,
      assigneeId,
      assignedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Bulk delete tasks
  bulkDeleteTasks: async (taskIds) => {
    const response = await api.delete(`${WORKFLOW_TASKS_ENDPOINT}/bulk`, {
      data: { taskIds }
    });
    return response.data;
  },

  // Search and Filter
  // Search workflows
  searchWorkflows: async (query, params = {}) => {
    const response = await api.get(`${WORKFLOWS_ENDPOINT}?q=${query}`, { params });
    return response.data;
  },

  // Search tasks
  searchTasks: async (query, params = {}) => {
    const response = await api.get(`${WORKFLOW_TASKS_ENDPOINT}?q=${query}`, { params });
    return response.data;
  },

  // Get filtered workflows
  getFilteredWorkflows: async (filters = {}) => {
    let url = WORKFLOWS_ENDPOINT;
    const params = new URLSearchParams();

    if (filters.module) params.append('module', filters.module);
    if (filters.status) params.append('status', filters.status);
    if (filters.createdBy) params.append('createdBy', filters.createdBy);
    if (filters.createdFrom) params.append('createdAt_gte', filters.createdFrom);
    if (filters.createdTo) params.append('createdAt_lte', filters.createdTo);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  getFilteredTasks: async (filters = {}) => {
    let url = WORKFLOW_TASKS_ENDPOINT;
    const params = new URLSearchParams();

    if (filters.workflowId) params.append('workflowId', filters.workflowId);
    if (filters.assigneeId) params.append('assigneeId', filters.assigneeId);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.dueDateFrom) params.append('dueDate_gte', filters.dueDateFrom);
    if (filters.dueDateTo) params.append('dueDate_lte', filters.dueDateTo);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Export
  // Export workflows
  exportWorkflows: async (filters = {}, format = 'excel') => {
    let url = `${WORKFLOWS_ENDPOINT}/export?format=${format}`;

    const params = new URLSearchParams();
    if (filters.module) params.append('module', filters.module);
    if (filters.status) params.append('status', filters.status);

    if (params.toString()) {
      url += `&${params.toString()}`;
    }

    const response = await api.get(url, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Export tasks
  exportTasks: async (filters = {}, format = 'excel') => {
    let url = `${WORKFLOW_TASKS_ENDPOINT}/export?format=${format}`;

    const params = new URLSearchParams();
    if (filters.workflowId) params.append('workflowId', filters.workflowId);
    if (filters.assigneeId) params.append('assigneeId', filters.assigneeId);
    if (filters.status) params.append('status', filters.status);

    if (params.toString()) {
      url += `&${params.toString()}`;
    }

    const response = await api.get(url, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Notifications
  // Get workflow notifications
  getWorkflowNotifications: async (userId, params = {}) => {
    const response = await api.get(`${WORKFLOW_TASKS_ENDPOINT}/notifications/${userId}`, { params });
    return response.data;
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    const response = await api.patch(`${WORKFLOW_TASKS_ENDPOINT}/notifications/${notificationId}`, {
      isRead: true,
      readAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Get workflow settings
  getWorkflowSettings: async () => {
    const response = await api.get(`${WORKFLOWS_ENDPOINT}/settings`);
    return response.data;
  },

  // Update workflow settings
  updateWorkflowSettings: async (settings) => {
    const response = await api.put(`${WORKFLOWS_ENDPOINT}/settings`, {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },
};
