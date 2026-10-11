import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT token stored under 'srq_token' to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('srq_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired or invalid credentials
      localStorage.removeItem('srq_token');
      localStorage.removeItem('srq_user');
      window.dispatchEvent(new Event('srq-session-expired'));
    }
    return Promise.reject(error);
  }
);

export default api;
