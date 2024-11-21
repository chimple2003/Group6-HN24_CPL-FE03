import axios from 'axios';
import { API_PREFIX } from '../constants/setting';

const instance = axios.create({
  baseURL: API_PREFIX,
  timeout: 5000,
  // withCredentials: true,
});

instance.interceptors.request.use(req => {
  const token = localStorage.getItem('token') || '';
  if (token) req.headers.Authorization = token;
  return req;
});

instance.interceptors.response.use(res => {
  return res;
}, err => {
  if (err && err.response && err.response.status === 401) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  }
  return Promise.reject(err && err.response && err.response.data);
});

export default instance;
