import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Bearer Token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("resumehance_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally (e.g. 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the user is unauthorized
    if (error.response && error.response.status === 401) {
      // Clear token and redirect if needed (or let the auth store/provider handle it)
      localStorage.removeItem("resumehance_token");
      // Optional: dispatch logout or trigger a page reload/redirect to /login
      if (window.location.pathname !== "/login" && window.location.pathname !== "/" && window.location.pathname !== "/signup") {
        window.location.href = "/login";
      }
    }
    
    // Normalize error message for easier consumption in UI
    const normalizedError = {
      message: error.response?.data?.detail || error.response?.data?.message || error.message || "An unexpected error occurred",
      status: error.response?.status,
      data: error.response?.data,
    };
    
    return Promise.reject(normalizedError);
  }
);

export default apiClient;
