import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// const API_URL = import.meta.env.VITE_API_URL || "https://api.mendt.in/api";

if (!import.meta.env.VITE_API_URL) {
  console.warn("VITE_API_URL is not set, using default API URL.");
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration and refresh logic here if needed
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Add logic to refresh the token or redirect to login
    }

    return Promise.reject(error);
  }
);

export default api;
