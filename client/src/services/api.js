import axios from "axios";

/**
 * Resolves the API base URL intelligently:
 * 1. Sanitizes and normalizes VITE_API_URL if provided (strips trailing slashes, appends /api if omitted).
 * 2. If running locally on localhost/127.0.0.1 and no VITE_API_URL is set, defaults to http://localhost:5000/api.
 * 3. In production on the web (Vercel, Netlify, Render, etc.) without VITE_API_URL, defaults to the live Render backend.
 */
export const getBaseURL = () => {
  let url = (import.meta.env.VITE_API_URL || "").trim();

  if (!url) {
    if (
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
    ) {
      return "http://localhost:5000/api";
    }
    return "https://smart-sugarcane-forming-and-milloperation.onrender.com/api";
  }

  // Strip trailing slashes
  url = url.replace(/\/+$/, "");

  // Ensure /api path is present so endpoints like /auth/login resolve to /api/auth/login
  if (!url.endsWith("/api")) {
    url = `${url}/api`;
  }

  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000, // 60s timeout accommodates Render free-tier cold starts
});

// Attach the token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("agrocane_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token expired, clear it and send the user to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Only clear stored token on session expiry, not failed login submissions
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/login") &&
      !error.config?.url?.includes("/auth/admin-login")
    ) {
      localStorage.removeItem("agrocane_token");
      localStorage.removeItem("agrocane_user");
    }
    return Promise.reject(error);
  }
);

// Turns any Axios error into a clear, actionable message
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.error) return error.response.data.error;
  if (typeof error.response?.data === "string" && error.response.data.trim()) {
    return error.response.data;
  }

  if (error.code === "ECONNABORTED") {
    return "The server took too long to respond. The cloud service may be waking up, please try again in a moment.";
  }

  if (!error.response) {
    return "Cannot reach the server. Check your internet or try later. (If the server was idle, please allow ~30 seconds for it to wake up).";
  }

  if (error.response?.status === 404) {
    return "Requested resource was not found (404).";
  }

  if (error.response?.status === 500) {
    return "Internal server error. Please try again shortly.";
  }

  return "Something went wrong. Please try again.";
};

export default api;
