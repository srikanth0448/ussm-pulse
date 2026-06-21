import axios from "axios";
import { apiBaseUrl } from "../../constants/apiBaseUrl";

// Create a function to generate Axios instances with a specific base URL
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL: baseURL,
  });

  // Add a request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  return instance;
};

const api = createAxiosInstance(apiBaseUrl);

export { api };
