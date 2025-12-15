import axios from 'axios';

// Helper function to get cookies
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// Base URL for the real API
const API_BASE_URL = ' https://localhost:7291';

// Create Axios instance for authentication
export const ClientAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add access token
export const setupRequestInterceptor = () => {
  ClientAPI.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// Response interceptor to handle token refresh
export const setupResponseInterceptor = () => {
  ClientAPI.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            // Attempt to refresh token
            const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
              refreshToken,
            });

            const { token: newAccessToken, refreshToken: newRefreshToken } = response.data;

            // Update stored tokens
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return ClientAPI(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userId');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

// Function to initialize interceptors
export const initializeInterceptors = () => {
  setupRequestInterceptor();
  setupResponseInterceptor();
};

// Export the ClientAPI instance for use in other files
export default ClientAPI;
