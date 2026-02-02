import axios from "axios";

import { API_BASE } from "../config";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
