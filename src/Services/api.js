import axios from "axios";

const api = axios.create({
  baseURL: "https://educat.codeweb.com.ng",
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
   const token = localStorage.getItem("scrmToken"); // ✅ match login

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
