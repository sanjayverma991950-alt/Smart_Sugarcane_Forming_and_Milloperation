import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 20000,
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
    if (error.response?.status === 401) {
      localStorage.removeItem("agrocane_token");
      localStorage.removeItem("agrocane_user");
    }
    return Promise.reject(error);
  }
);

// Turns any Axios error into a readable message
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === "ECONNABORTED") return "The request timed out. Please try again.";
  if (!error.response) return "Cannot reach the server. Check your internet or try later.";
  return "Something went wrong. Please try again.";
};

export default api;
