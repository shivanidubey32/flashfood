import axios from 'axios';

// Create an Axios instance
const API = axios.create({
  baseURL: (import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api',
});

// Interceptor to attach the JWT token to requests if the user is logged in
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
