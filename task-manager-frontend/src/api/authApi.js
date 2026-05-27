import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  login: (email, password) =>
    api.post('/users/login', { email, password }).then((res) => res.data),

  register: (name, lastname, email, password) =>
    api.post('/users/register', { name, lastname, email, password }).then((res) => res.data),
};

export default api;