import axios from "axios";

const api = axios.create({
  baseURL: "https://wisecents-backend-dev-ewbgf0bxgwe9fta2.eastus2-01.azurewebsites.net/api"
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
