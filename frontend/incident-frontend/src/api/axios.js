// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://incident-reporting-rjwi.onrender.com/api",

  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* ================= RESPONSE INTERCEPTOR ================= */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("role");
  localStorage.removeItem("department");

  // DO NOT redirect instantly
  // let React handle it
}
    
    return Promise.reject(error);
  }
);

export default api;
