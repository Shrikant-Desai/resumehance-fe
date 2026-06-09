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

// Response Interceptor: Handle errors globally and normalize the backend envelope
apiClient.interceptors.response.use(
  // ─── SUCCESS ──────────────────────────────────────────────────────────────
  // The backend always returns { success: true, message, data, [pagination] }
  // We pass the full axios response through; callers unwrap `.data` themselves.
  (response) => response,

  // ─── ERROR ────────────────────────────────────────────────────────────────
  // Backend error shape:
  //   { success: false, error: { code, message, details } }
  // Validation error shape (422):
  //   { success: false, error: { code: "VALIDATION_ERROR", message, details: [{ field, message }] } }
  (error) => {
    const responseData = error.response?.data;

    // Auto-logout on 401 UNAUTHORIZED (invalid / expired token)
    if (
      error.response?.status === 401 &&
      responseData?.error?.code === "UNAUTHORIZED"
    ) {
      localStorage.removeItem("resumehance_token");
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/" &&
        window.location.pathname !== "/signup"
      ) {
        window.location.href = "/login";
      }
    }

    // Build a structured error object from the backend envelope
    const backendError = responseData?.error;

    let message;
    if (backendError?.code === "VALIDATION_ERROR" && Array.isArray(backendError.details)) {
      // Concatenate field-level validation messages for a readable toast
      message = backendError.details
        .map((d) => `${d.field}: ${d.message}`)
        .join(" • ");
    } else {
      message =
        backendError?.message ||
        responseData?.message ||
        error.message ||
        "An unexpected error occurred.";
    }

    const normalizedError = {
      message,
      code: backendError?.code || null,
      details: backendError?.details || null,
      status: error.response?.status,
      raw: responseData,
    };

    return Promise.reject(normalizedError);
  }
);

export default apiClient;
