import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', // Use environment variable or fallback
});

// Request interceptor to include the token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error codes here if needed
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      console.error('Unauthorized access - maybe redirect to login?');
    }
    return Promise.reject(error);
  }
);

export { api };
