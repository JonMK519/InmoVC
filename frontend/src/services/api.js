import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const analyzeFile = async (fileId) => {
  const response = await api.post(`/api/analyze/${fileId}`);
  return response.data;
};

export const getResults = async (fileId) => {
  const response = await api.get(`/api/results/${fileId}`);
  return response.data;
};

export const getAllResults = async () => {
  const response = await api.get('/api/results');
  return response.data;
};

export const deleteResult = async (fileId) => {
  const response = await api.delete(`/api/results/${fileId}`);
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export default api;
