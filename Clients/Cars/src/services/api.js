import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://garage-75.onrender.com", // Fallback to local backend
});

// Automatically attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API Calls
export const registerUser = async (userData) => {
  return API.post("api/users/register", userData);
};

export const loginUser = async (userData) => {
  return API.post("api/users/login", userData);
};

export default API;