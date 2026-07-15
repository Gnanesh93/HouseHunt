import axios from 'axios';

// Centralized base URL configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enables sending secure HTTP-only cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Axios Request Interceptor: Inject JWT token into headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios Response Interceptor: Catch authorization errors (401) and handle auto-logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired. Redirecting to login.');
      // Auto-clear credentials on authorization failure
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatch custom event for App to redirect to login if necessary
      window.dispatchEvent(new Event('auth-expired'));
    }
    return Promise.reject(error);
  }
);

export default api;
