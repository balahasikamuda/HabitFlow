import axios from 'axios';

// Resolve API base URL: ensure it points to the backend /api prefix
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://habitflow-backend-988o.onrender.com/api';
// Normalize: remove trailing slash, and ensure ends with /api
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const API_BASE_URL = normalizedBaseUrl.endsWith('/api')
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('habitflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and not already on login or landing, clear token
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register') &&
        window.location.pathname !== '/'
      ) {
        localStorage.removeItem('habitflow_token');
        localStorage.removeItem('habitflow_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
