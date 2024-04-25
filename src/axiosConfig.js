// src/api/axiosConfig.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://academic-brandie-unbored.koyeb.app", // Ensure this is set correctly
});

// Ajouter un intercepteur de requête pour insérer le token avant chaque requête
//si tokenC est présent dans le localStorage c'est lui qui sera utilisé
//sinon on utilise le token
API.interceptors.request.use(
  (config) => {
    const tokenC = localStorage.getItem("tokenC");
    if (tokenC) {
      config.headers.Authorization = `Bearer ${tokenC}`;
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
