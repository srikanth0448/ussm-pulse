import axios from "axios";
import { apiBaseUrl } from"../constants/apiBaseUrl";
// Create a function to generate Axios instances with a specific base URL
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL: baseURL,
  });

  // Add a request interceptor
  instance.interceptors.request.use(
    function (config) {
      // Check if JWT token exists and add it to the request headers
      const token = sessionStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  return instance;
};

const api = createAxiosInstance(apiBaseUrl);

export { api };
