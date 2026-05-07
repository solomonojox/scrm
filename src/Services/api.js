// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://educat.codeweb.com.ng",
// });

// // Attach token to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("scrmToken"); // ✅ match login
//     const refreshToken = localStorage.getItem("scrmRefreshToken"); // ✅ match login

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     if (refreshToken) {
//       config.headers.refreshToken = `Bearer ${refreshToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// export default api;




import axios from "axios";

const api = axios.create({
  baseURL: "https://educat.codeweb.com.ng",
});

// REQUEST interceptor — attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("scrmToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE interceptor — handle token refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const accessToken = localStorage.getItem("scrmToken");
      const refreshToken = localStorage.getItem("scrmRefreshToken");

      try {
        const { data } = await axios.post(
          "https://educat.codeweb.com.ng/api/Login/RefreshToken",
          { accessToken, refreshToken },
        );

        console.log("Token refreshed:", data);

        localStorage.setItem("scrmToken", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("scrmRefreshToken", data.refreshToken);
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        processQueue(null, data.accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // processQueue(refreshError, null);
        localStorage.removeItem("scrmToken");
        localStorage.removeItem("scrmRefreshToken");
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;