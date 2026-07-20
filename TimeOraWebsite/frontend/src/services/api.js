import axios from 'axios';

// Create central Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token into Bearer auth header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tickora_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch authorization and session errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request detected. Clearing invalid authentication states.');
      localStorage.removeItem('tickora_token');
      localStorage.removeItem('tickora_user');
      // Optional: Redirect to login or trigger global logout hook
    }
    return Promise.reject(error);
  }
);

export default API;
