import axios from "axios";

const cbtApi = axios.create({
  baseURL: "https://educatquizapi.onrender.com",
});

// Attach token to every request
cbtApi.interceptors.request.use(
  (config) => {
   const token = localStorage.getItem("cbtToken"); // ✅ match login

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default cbtApi;
