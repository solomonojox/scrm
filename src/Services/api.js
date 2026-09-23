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

const BASE_URL = "https://scrmapi-lpkm.onrender.com";
// const BASE_URL = "https://educat.codeweb.com.ng";

const api = axios.create({
  baseURL: BASE_URL,
});


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


let isRefreshing = false;

let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};


api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Prevent refresh for authentication endpoints
    const authEndpoints = [
      "/api/Login/Login",
      "/api/Login/RefreshToken",
    ];

    const shouldSkipRefresh = authEndpoints.some((endpoint) =>
      originalRequest?.url?.includes(endpoint),
    );

    const accessToken = localStorage.getItem("scrmToken");
    const refreshToken = localStorage.getItem("scrmRefreshToken");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh &&
      refreshToken
    ) {
      // If another refresh request is already running,
      // wait until it finishes.
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

      try {
        const { data } = await axios.post(
          `${BASE_URL}/api/Login/RefreshToken`,
          {
            accessToken,
            refreshToken,
          },
        );

        // Save new tokens
        localStorage.setItem("scrmToken", data.accessToken);

        if (data.refreshToken) {
          localStorage.setItem(
            "scrmRefreshToken",
            data.refreshToken,
          );
        }

        // Update axios defaults
        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        // Retry queued requests
        processQueue(null, data.accessToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        localStorage.removeItem("scrmToken");
        localStorage.removeItem("scrmRefreshToken");

        // Optional: redirect to login
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