import api from './api.js';

const USERS_ENDPOINT = '/users';
const ROLES_ENDPOINT = '/roles';
const PERMISSIONS_ENDPOINT = '/permissions';

export const userManagementService = {
  // Users Management
  // Get all users
  getAllUsers: async (params = {}) => {
    const response = await api.get(USERS_ENDPOINT, { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`${USERS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get users by role
  getUsersByRole: async (roleId, params = {}) => {
    const response = await api.get(`${USERS_ENDPOINT}?roleId=${roleId}`, { params });
    return response.data;
  },

  // Get users by status
  getUsersByStatus: async (status, params = {}) => {
    const response = await api.get(`${USERS_ENDPOINT}?status=${status}`, { params });
    return response.data;
  },

  // Create user
  createUser: async (userData) => {
    const response = await api.post(USERS_ENDPOINT, {
      ...userData,
      status: userData.status || 'active',
      createdAt: new Date().toISOString(),
      lastLogin: null,
      passwordResetRequired: true,
    });
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`${USERS_ENDPOINT}/${id}`, {
      ...userData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update user status
  updateUserStatus: async (id, status) => {
    const response = await api.patch(`${USERS_ENDPOINT}/${id}`, {
      status,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`${USERS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Change user password
  changePassword: async (id, passwordData) => {
    const response = await api.patch(`${USERS_ENDPOINT}/${id}/password`, {
      ...passwordData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Reset user password
  resetPassword: async (id) => {
    const response = await api.post(`${USERS_ENDPOINT}/${id}/reset-password`, {
      resetAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Assign role to user
  assignRole: async (userId, roleId) => {
    const response = await api.post(`${USERS_ENDPOINT}/${userId}/roles`, {
      roleId,
      assignedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Remove role from user
  removeRole: async (userId, roleId) => {
    const response = await api.delete(`${USERS_ENDPOINT}/${userId}/roles/${roleId}`);
    return response.data;
  },

  // Get user roles
  getUserRoles: async (userId) => {
    const response = await api.get(`${USERS_ENDPOINT}/${userId}/roles`);
    return response.data;
  },

  // Get user permissions
  getUserPermissions: async (userId) => {
    const response = await api.get(`${USERS_ENDPOINT}/${userId}/permissions`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (id, profileData) => {
    const response = await api.put(`${USERS_ENDPOINT}/${id}/profile`, {
      ...profileData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Upload user avatar
  uploadAvatar: async (id, avatarFile) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const response = await api.post(`${USERS_ENDPOINT}/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user activity logs
  getUserActivity: async (id, params = {}) => {
    const response = await api.get(`${USERS_ENDPOINT}/${id}/activity`, { params });
    return response.data;
  },

  // Bulk create users
  bulkCreateUsers: async (usersData) => {
    const users = usersData.map(user => ({
      ...user,
      status: user.status || 'active',
      createdAt: new Date().toISOString(),
      lastLogin: null,
      passwordResetRequired: true,
    }));

    const response = await api.post(`${USERS_ENDPOINT}/bulk`, users);
    return response.data;
  },

  // Bulk update user status
  bulkUpdateUserStatus: async (userIds, status) => {
    const response = await api.patch(`${USERS_ENDPOINT}/bulk/status`, {
      userIds,
      status,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Bulk delete users
  bulkDeleteUsers: async (userIds) => {
    const response = await api.delete(`${USERS_ENDPOINT}/bulk`, {
      data: { userIds }
    });
    return response.data;
  },

  // Roles Management
  // Get all roles
  getAllRoles: async (params = {}) => {
    const response = await api.get(ROLES_ENDPOINT, { params });
    return response.data;
  },

  // Get role by ID
  getRoleById: async (id) => {
    const response = await api.get(`${ROLES_ENDPOINT}/${id}`);
    return response.data;
  },

  // Create role
  createRole: async (roleData) => {
    const response = await api.post(ROLES_ENDPOINT, {
      ...roleData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update role
  updateRole: async (id, roleData) => {
    const response = await api.put(`${ROLES_ENDPOINT}/${id}`, {
      ...roleData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete role
  deleteRole: async (id) => {
    const response = await api.delete(`${ROLES_ENDPOINT}/${id}`);
    return response.data;
  },

  // Assign permission to role
  assignPermissionToRole: async (roleId, permissionId) => {
    const response = await api.post(`${ROLES_ENDPOINT}/${roleId}/permissions`, {
      permissionId,
      assignedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Remove permission from role
  removePermissionFromRole: async (roleId, permissionId) => {
    const response = await api.delete(`${ROLES_ENDPOINT}/${roleId}/permissions/${permissionId}`);
    return response.data;
  },

  // Get role permissions
  getRolePermissions: async (roleId) => {
    const response = await api.get(`${ROLES_ENDPOINT}/${roleId}/permissions`);
    return response.data;
  },

  // Get users with role
  getUsersWithRole: async (roleId) => {
    const response = await api.get(`${ROLES_ENDPOINT}/${roleId}/users`);
    return response.data;
  },

  // Permissions Management
  // Get all permissions
  getAllPermissions: async (params = {}) => {
    const response = await api.get(PERMISSIONS_ENDPOINT, { params });
    return response.data;
  },

  // Get permission by ID
  getPermissionById: async (id) => {
    const response = await api.get(`${PERMISSIONS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get permissions by module
  getPermissionsByModule: async (module, params = {}) => {
    const response = await api.get(`${PERMISSIONS_ENDPOINT}?module=${module}`, { params });
    return response.data;
  },

  // Create permission
  createPermission: async (permissionData) => {
    const response = await api.post(PERMISSIONS_ENDPOINT, {
      ...permissionData,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update permission
  updatePermission: async (id, permissionData) => {
    const response = await api.put(`${PERMISSIONS_ENDPOINT}/${id}`, {
      ...permissionData,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Delete permission
  deletePermission: async (id) => {
    const response = await api.delete(`${PERMISSIONS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get roles with permission
  getRolesWithPermission: async (permissionId) => {
    const response = await api.get(`${PERMISSIONS_ENDPOINT}/${permissionId}/roles`);
    return response.data;
  },

  // Authentication & Authorization
  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Verify token
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  // Check permission
  checkPermission: async (permission) => {
    const response = await api.get(`/auth/check-permission?permission=${permission}`);
    return response.data;
  },

  // Get user menu based on permissions
  getUserMenu: async () => {
    const response = await api.get('/auth/menu');
    return response.data;
  },

  // Search and Filter
  // Search users
  searchUsers: async (query, params = {}) => {
    const response = await api.get(`${USERS_ENDPOINT}?q=${query}`, { params });
    return response.data;
  },

  // Search roles
  searchRoles: async (query, params = {}) => {
    const response = await api.get(`${ROLES_ENDPOINT}?q=${query}`, { params });
    return response.data;
  },

  // Search permissions
  searchPermissions: async (query, params = {}) => {
    const response = await api.get(`${PERMISSIONS_ENDPOINT}?q=${query}`, { params });
    return response.data;
  },

  // Advanced filtering
  getFilteredUsers: async (filters = {}) => {
    let url = USERS_ENDPOINT;
    const params = new URLSearchParams();

    if (filters.roleId) params.append('roleId', filters.roleId);
    if (filters.status) params.append('status', filters.status);
    if (filters.department) params.append('department', filters.department);
    if (filters.createdFrom) params.append('createdAt_gte', filters.createdFrom);
    if (filters.createdTo) params.append('createdAt_lte', filters.createdTo);
    if (filters.lastLoginFrom) params.append('lastLogin_gte', filters.lastLoginFrom);
    if (filters.lastLoginTo) params.append('lastLogin_lte', filters.lastLoginTo);

    params.append('_sort', 'createdAt');
    params.append('_order', 'desc');

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  getFilteredRoles: async (filters = {}) => {
    let url = ROLES_ENDPOINT;
    const params = new URLSearchParams();

    if (filters.module) params.append('module', filters.module);
    if (filters.level) params.append('level', filters.level);
    if (filters.createdFrom) params.append('createdAt_gte', filters.createdFrom);
    if (filters.createdTo) params.append('createdAt_lte', filters.createdTo);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  getFilteredPermissions: async (filters = {}) => {
    let url = PERMISSIONS_ENDPOINT;
    const params = new URLSearchParams();

    if (filters.module) params.append('module', filters.module);
    if (filters.type) params.append('type', filters.type);
    if (filters.createdFrom) params.append('createdAt_gte', filters.createdFrom);
    if (filters.createdTo) params.append('createdAt_lte', filters.createdTo);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Statistics and Reports
  // Get user management statistics
  getUserStats: async () => {
    const response = await api.get(`${USERS_ENDPOINT}/stats`);
    return response.data;
  },

  // Get role statistics
  getRoleStats: async () => {
    const response = await api.get(`${ROLES_ENDPOINT}/stats`);
    return response.data;
  },

  // Get permission statistics
  getPermissionStats: async () => {
    const response = await api.get(`${PERMISSIONS_ENDPOINT}/stats`);
    return response.data;
  },

  // Export users
  exportUsers: async (filters = {}, format = 'excel') => {
    let url = `${USERS_ENDPOINT}/export?format=${format}`;

    const params = new URLSearchParams();
    if (filters.roleId) params.append('roleId', filters.roleId);
    if (filters.status) params.append('status', filters.status);
    if (filters.department) params.append('department', filters.department);

    if (params.toString()) {
      url += `&${params.toString()}`;
    }

    const response = await api.get(url, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Export roles
  exportRoles: async (format = 'excel') => {
    const response = await api.get(`${ROLES_ENDPOINT}/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Export permissions
  exportPermissions: async (format = 'excel') => {
    const response = await api.get(`${PERMISSIONS_ENDPOINT}/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },
};
