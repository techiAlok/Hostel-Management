import axios from 'axios';

// Dynamically pulls localhost during dev, and your cloud URL in production
const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;