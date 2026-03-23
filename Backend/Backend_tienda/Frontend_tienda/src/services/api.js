import axios from 'axios';

const API_BASE_URL = 'https://localhost:7246/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  httpsAgent: { rejectUnauthorized: false },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en llamada API:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
