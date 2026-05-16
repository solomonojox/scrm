import axios from "axios";

const cbtApi = axios.create({
  baseURL: "https://d52n02nk-7015.uks1.devtunnels.ms",
  // baseURL: "https://educatquizapi.onrender.com",
});

// Attach token to every request
cbtApi.interceptors.request.use(
  (config) => {
   const token = localStorage.getItem("cbtToken"); // match login

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default cbtApi;
