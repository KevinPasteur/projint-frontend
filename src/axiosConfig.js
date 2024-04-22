// src/api/axiosConfig.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // Ensure this is set correctly
});

// Ajouter un intercepteur de requête pour insérer le token avant chaque requête
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
