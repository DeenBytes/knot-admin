import axios from 'axios';
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:2100/',
  timeout: 25000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const apiJson = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:2100/',
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
  },
});
const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:2100/",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const apiJsonAuth = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:2100/",
  timeout: 25000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to dynamically set the token before each request
const addAuthTokenInterceptor = (instance) => {
  instance.interceptors.request.use((config) => {
    const auth = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  });
};

addAuthTokenInterceptor(apiAuth);
addAuthTokenInterceptor(apiJsonAuth);

export { apiAuth, apiJsonAuth };