import axios from 'axios';
import keycloak from '../auth/keycloak';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to attach Bearer token
axiosClient.interceptors.request.use(
  async (config) => {
    if (keycloak && keycloak.token) {
      try {
        // Refresh token if within 30 seconds of expiry
        await keycloak.updateToken(30);
      } catch (err) {
        console.warn('Failed to refresh token before request', err);
      }
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors gracefully
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      const { status, data } = error.response;

      if (data && typeof data === 'object') {
        errorMessage = data.message || data.error || (data.errors ? Object.values(data.errors).join(', ') : errorMessage);
      } else if (typeof data === 'string' && data.length > 0 && data.length < 200) {
        errorMessage = data;
      }

      if (status === 401) {
        console.warn('Unauthorized access (401)');
      } else if (status === 403) {
        console.warn('Forbidden resource (403)');
      }
    } else if (error.request) {
      errorMessage = 'Network error: Unable to reach the server. Please check your backend connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.status = error.response?.status;
    enhancedError.originalError = error;
    return Promise.reject(enhancedError);
  }
);

export default axiosClient;
