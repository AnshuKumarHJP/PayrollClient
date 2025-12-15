import api from './api.js';

const TEAM_MEMBERS_ENDPOINT = '/teamMembers';
const TEAM_TASKS_ENDPOINT = '/teamTasks';
const TEAM_PERFORMANCE_ENDPOINT = '/teamPerformance';

export const teamService = {
  // Team Members
  // Get all team members
  getAllMembers: async (params = {}) => {
    const response = await api.get(TEAM_MEMBERS_ENDPOINT, { params });
    return response.data;
  },

  // Get team member by ID
  getMemberById: async (id) => {
    const response = await api.get(`${TEAM_MEMBERS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get team members by status
  getMembersByStatus: async (status, params = {}) => {
    const response = await api.get(`${TEAM_MEMBERS_ENDPOINT}?status=${status}`, { params });
    return response.data;
  },

  // Get team members by role
  getMembersByRole: async (role, params = {}) => {
    const response = await api.get(`${TEAM_MEMBERS_ENDPOINT}?role=${role}`, { params });
    return response.data;
  },

  // Create team member
  createMember: async (memberData) => {
    const response = await api.post(TEAM_MEMBERS_ENDPOINT, {
      ...memberData,
      joinDate: memberData.joinDate || new Date().toISOString().split('T')[0],
      status: memberData.status || 'active',
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update team member
  updateMember: async (id, memberData) => {
    const response = await api.put(`${TEAM_MEMBERS_ENDPOINT}/${id}`, {
      ...memberData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update member status
  updateMemberStatus: async (id, status) => {
    const response = await api.patch(`${TEAM_MEMBERS_ENDPOINT}/${id}`, {
      status,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete team member
  deleteMember: async (id) => {
    const response = await api.delete(`${TEAM_MEMBERS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get member performance
  getMemberPerformance: async (id, timeRange = '30d') => {
    const response = await api.get(`${TEAM_MEMBERS_ENDPOINT}/${id}/performance?timeRange=${timeRange}`);
    return response.data;
  },

  // Update member performance metrics
  updateMemberPerformance: async (id, performanceData) => {
    const response = await api.put(`${TEAM_MEMBERS_ENDPOINT}/${id}/performance`, {
      ...performanceData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Team Tasks
  // Get all team tasks
  getAllTasks: async (params = {}) => {
    const response = await api.get(TEAM_TASKS_ENDPOINT, { params });
    return response.data;
  },

  // Get team task by ID
  getTaskById: async (id) => {
    const response = await api.get(`${TEAM_TASKS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get tasks by assignee
  getTasksByAssignee: async (assigneeId, params = {}) => {
    const response = await api.get(`${TEAM_TASKS_ENDPOINT}?assignedTo=${assigneeId}`, { params });
    return response.data;
  },

  // Get tasks by status
  getTasksByStatus: async (status, params = {}) => {
    const response = await api.get(`${TEAM_TASKS_ENDPOINT}?status=${status}`, { params });
    return response.data;
  },

  // Get tasks by priority
  getTasksByPriority: async (priority, params = {}) => {
    const response = await api.get(`${TEAM_TASKS_ENDPOINT}?priority=${priority}`, { params });
    return response.data;
  },

  // Create team task
  createTask: async (taskData) => {
    const response = await api.post(TEAM_TASKS_ENDPOINT, {
      ...taskData,
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      createdAt: new Date().toISOString(),
      dueDate: taskData.dueDate || null,
    });
    return response.data;
  },

  // Update team task
  updateTask: async (id, taskData) => {
    const response = await api.put(`${TEAM_TASKS_ENDPOINT}/${id}`, {
      ...taskData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update task status
  updateTaskStatus: async (id, status) => {
    const response = await api.patch(`${TEAM_TASKS_ENDPOINT}/${id}`, {
      status,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Assign task to member
  assignTask: async (id, assigneeId) => {
    const response = await api.patch(`${TEAM_TASKS_ENDPOINT}/${id}`, {
      assignedTo: assigneeId,
      assignedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete team task
  deleteTask: async (id) => {
    const response = await api.delete(`${TEAM_TASKS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get task comments
  getTaskComments: async (id) => {
    const response = await api.get(`${TEAM_TASKS_ENDPOINT}/${id}/comments`);
    return response.data;
  },

  // Add task comment
  addTaskComment: async (id, commentData) => {
    const response = await api.post(`${TEAM_TASKS_ENDPOINT}/${id}/comments`, {
      ...commentData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Team Performance
  // Get team performance overview
  getTeamPerformance: async (timeRange = '30d') => {
    const response = await api.get(`${TEAM_PERFORMANCE_ENDPOINT}?timeRange=${timeRange}`);
    return response.data;
  },

  // Get team performance by period
  getTeamPerformanceByPeriod: async (startDate, endDate) => {
    const response = await api.get(`${TEAM_PERFORMANCE_ENDPOINT}?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // Get team efficiency metrics
  getTeamEfficiency: async (timeRange = '30d') => {
    const response = await api.get(`${TEAM_PERFORMANCE_ENDPOINT}/efficiency?timeRange=${timeRange}`);
    return response.data;
  },

  // Get team workload distribution
  getTeamWorkload: async () => {
    const response = await api.get(`${TEAM_PERFORMANCE_ENDPOINT}/workload`);
    return response.data;
  },

  // Get team activity summary
  getTeamActivity: async (timeRange = '7d') => {
    const response = await api.get(`${TEAM_PERFORMANCE_ENDPOINT}/activity?timeRange=${timeRange}`);
    return response.data;
  },

  // Update team performance data
  updateTeamPerformance: async (performanceData) => {
    const response = await api.put(TEAM_PERFORMANCE_ENDPOINT, {
      ...performanceData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Team Dashboard Data
  // Get team dashboard overview
  getTeamDashboard: async () => {
    const [members, tasks, performance] = await Promise.all([
      teamService.getAllMembers(),
      teamService.getAllTasks(),
      teamService.getTeamPerformance()
    ]);

    const activeMembers = members.filter(m => m.status === 'active');
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    return {
      summary: {
        totalMembers: members.length,
        activeMembers: activeMembers.length,
        totalTasks: tasks.length,
        pendingTasks: pendingTasks.length,
        inProgressTasks: inProgressTasks.length,
        completedTasks: completedTasks.length,
      },
      members: activeMembers,
      tasks: tasks.slice(0, 10), // Recent tasks
      performance,
    };
  },

  // Get team member dashboard
  getMemberDashboard: async (memberId) => {
    const [member, tasks, performance] = await Promise.all([
      teamService.getMemberById(memberId),
      teamService.getTasksByAssignee(memberId),
      teamService.getMemberPerformance(memberId)
    ]);

    return {
      member,
      tasks,
      performance,
      summary: {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        pendingTasks: tasks.filter(t => t.status === 'pending').length,
        inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
      }
    };
  },

  // Bulk operations
  // Bulk create team members
  bulkCreateMembers: async (membersData) => {
    const members = membersData.map(member => ({
      ...member,
      joinDate: member.joinDate || new Date().toISOString().split('T')[0],
      status: member.status || 'active',
      createdAt: new Date().toISOString(),
    }));

    const response = await api.post(`${TEAM_MEMBERS_ENDPOINT}/bulk`, members);
    return response.data;
  },

  // Bulk update member status
  bulkUpdateMemberStatus: async (memberIds, status) => {
    const response = await api.patch(`${TEAM_MEMBERS_ENDPOINT}/bulk/status`, {
      memberIds,
      status,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Bulk assign tasks
  bulkAssignTasks: async (taskIds, assigneeId) => {
    const response = await api.patch(`${TEAM_TASKS_ENDPOINT}/bulk/assign`, {
      taskIds,
      assigneeId,
      assignedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Search and Filter
  // Search team members
  searchMembers: async (query, params = {}) => {
    const response = await api.get(`${TEAM_MEMBERS_ENDPOINT}?q=${query}`, { params });
    return response.data;
  },

  // Search team tasks
  searchTasks: async (query, params = {}) => {
    const response = await api.get(`${TEAM_TASKS_ENDPOINT}?q=${query}`, { params });
    return response.data;
  },

  // Advanced filtering
  getFilteredMembers: async (filters = {}) => {
    let url = TEAM_MEMBERS_ENDPOINT;
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.role) params.append('role', filters.role);
    if (filters.department) params.append('department', filters.department);
    if (filters.joinDateFrom) params.append('joinDate_gte', filters.joinDateFrom);
    if (filters.joinDateTo) params.append('joinDate_lte', filters.joinDateTo);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  getFilteredTasks: async (filters = {}) => {
    let url = TEAM_TASKS_ENDPOINT;
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
    if (filters.dueDateFrom) params.append('dueDate_gte', filters.dueDateFrom);
    if (filters.dueDateTo) params.append('dueDate_lte', filters.dueDateTo);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  },
};
