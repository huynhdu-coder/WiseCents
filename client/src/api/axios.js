import axios from "axios";

const api = axios.create({
  baseURL: "https://victorious-hill-01f04f60f.3.azurestaticapps.net/api"",
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
