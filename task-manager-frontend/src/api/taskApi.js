import axios from 'axios';

const TOKEN_KEY = 'auth_token';

const getToken = () => localStorage.getItem(TOKEN_KEY);

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const taskApi = {
  getAll: () => api.get('/tasks').then((res) => res.data),
  getById: (id) => api.get(`/tasks/${id}`).then((res) => res.data),
  create: (data) => api.post('/tasks', data).then((res) => res.data),
  update: (id, data) => api.put(`/tasks/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/tasks/${id}`),
};

export default api;