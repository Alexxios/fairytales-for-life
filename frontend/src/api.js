import axios from "axios";

// Create an instance of axios with the base URL
const api = axios.create({
    baseURL: "http://localhost:8000"
})

// Добавляем интерсептор для автоматической вставки токена
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

// Export the Axios instance
export default api;