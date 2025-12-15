import { ClientAPI } from './axiosConfig.js';

// Login function
export const login = async (userName, password) => {
  try {
    const response = await ClientAPI.post('/api/auth/login', {
      UserName: userName,
      Password: password,
    });

    const { Token, RefreshToken, SessionUserCode } = response.data;

    // Store tokens and user ID
    localStorage.setItem('accessToken', Token);
    localStorage.setItem('refreshToken', RefreshToken);

    return { success: true, userId: SessionUserCode };
  } catch (error) {
    throw new Error(error.response?.data?.Message || 'Login failed');
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await ClientAPI.get('/api/auth/current-user');
    return response.data.Data;
  } catch (error) {
    throw new Error(error.response?.data?.Message || 'Failed to get current user');
  }
};

// Logout function
export const logout = async () => {
  try {
    await ClientAPI.post('/api/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};

// Get stored user ID
export const getUserId = () => {
  return localStorage.getItem('userId');
};
