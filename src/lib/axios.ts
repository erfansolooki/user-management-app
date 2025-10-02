/**
 * Axios instance with interceptors for error handling
 * Provides centralized API configuration and error management
 */
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import toast from "react-hot-toast";

// Create axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://reqres.in/api",
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "reqres-free-v1", // ReqRes API key
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Add timestamp to prevent caching
    if (config.params) {
      config.params._t = Date.now();
    } else {
      config.params = { _t: Date.now() };
    }

    // Add auth token if available
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    const { response, request, message } = error;

    // Handle different types of errors
    if (response) {
      // Server responded with error status
      const { status, data } = response;
      const errorMessage = (data as any)?.error || `Server Error (${status})`;

      switch (status) {
        case 400:
          console.error("❌ Bad Request (400):", errorMessage);
          toast.error("Invalid request. Please check your input.");
          break;

        case 401:
          console.error("❌ Unauthorized (401):", errorMessage);
          toast.error("Session expired. Please login again.");
          // Clear auth data and redirect to login
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_data");
          window.location.href = "/login";
          break;

        case 403:
          console.error("❌ Forbidden (403):", errorMessage);
          toast.error("You do not have permission to perform this action.");
          break;

        case 404:
          console.error("❌ Not Found (404):", errorMessage);
          toast.error("The requested resource was not found.");
          break;

        case 422:
          console.error("❌ Validation Error (422):", errorMessage);
          toast.error("Please check your input and try again.");
          break;

        case 429:
          console.error("❌ Too Many Requests (429):", errorMessage);
          toast.error("Too many requests. Please wait a moment and try again.");
          break;

        case 500:
          console.error("❌ Internal Server Error (500):", errorMessage);
          toast.error("Server error. Please try again later.");
          break;

        case 502:
          console.error("❌ Bad Gateway (502):", errorMessage);
          toast.error(
            "Service temporarily unavailable. Please try again later."
          );
          break;

        case 503:
          console.error("❌ Service Unavailable (503):", errorMessage);
          toast.error(
            "Service temporarily unavailable. Please try again later."
          );
          break;

        default:
          console.error(`❌ HTTP Error (${status}):`, errorMessage);
          toast.error(`Server error (${status}). Please try again.`);
      }

      // Create a custom error object with more details
      const customError = new Error(errorMessage);
      (customError as any).status = status;
      (customError as any).response = response;
      return Promise.reject(customError);
    } else if (request) {
      // Request was made but no response received
      console.error("❌ Network Error:", "No response received from server");
      toast.error("Network error. Please check your connection and try again.");

      const networkError = new Error("Network Error: No response from server");
      (networkError as any).code = "NETWORK_ERROR";
      return Promise.reject(networkError);
    } else {
      // Something else happened
      console.error("❌ Request Setup Error:", message);
      toast.error("Request failed. Please try again.");

      const setupError = new Error(`Request Error: ${message}`);
      (setupError as any).code = "REQUEST_ERROR";
      return Promise.reject(setupError);
    }
  }
);

export default axiosInstance;
