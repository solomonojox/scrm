import axios from "axios";

const BASE_URL = "https://scrmapi-lpkm.onrender.com";
// const BASE_URL = "https://educat.codeweb.com.ng";

const api = axios.create({
  baseURL: BASE_URL,
});


// REQUEST INTERCEPTOR

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


// REFRESH TOKEN STATE

let isRefreshing = false;

let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};


// RESPONSE INTERCEPTOR

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isRefreshRequest =
      originalRequest.url?.includes(
        "/api/Login/RefreshToken",
      );

    const isLoginRequest =
      originalRequest.url?.includes(
        "/api/Login/Login",
      );


    // Only refresh on 401
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isRefreshRequest ||
      isLoginRequest
    ) {
      return Promise.reject(error);
    }


    // Get refresh token
    const refreshToken =
      localStorage.getItem("scrmRefreshToken");

    const accessToken =
      localStorage.getItem("scrmToken");


    // No refresh token
    if (!refreshToken) {
      localStorage.removeItem("scrmToken");
      localStorage.removeItem("scrmRefreshToken");

      return Promise.reject(error);
    }


    // ANOTHER REQUEST IS ALREADY REFRESHING

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization =
            `Bearer ${newToken}`;

          return api(originalRequest);
        })
        .catch((refreshError) => {
          return Promise.reject(refreshError);
        });
    }


    // START REFRESH

    originalRequest._retry = true;
    isRefreshing = true;


    try {
      const response = await axios.post(
        `${BASE_URL}/api/Login/RefreshToken`,
        {
          accessToken,
          refreshToken,
        },
      );


      console.log(
        "Refresh token response:",
        response.data,
      );



      // IMPORTANT:
      //
      // Backend response:
      //
      // {
      //   status: true,
      //   responseCode: "00",
      //   responseMessage: "...",
      //   data: {
      //      accessToken: "...",
      //      refreshToken: "..."
      //   }
      // }


      const newAccessToken =
        response.data.data.accessToken;

      const newRefreshToken =
        response.data.data.refreshToken;


      if (!newAccessToken) {
        throw new Error(
          "Refresh endpoint did not return an access token",
        );
      }



      // SAVE NEW TOKENS


      localStorage.setItem(
        "scrmToken",
        newAccessToken,
      );

      if (newRefreshToken) {
        localStorage.setItem(
          "scrmRefreshToken",
          newRefreshToken,
        );
      }



      // UPDATE AXIOS DEFAULT TOKEN


      api.defaults.headers.common.Authorization =
        `Bearer ${newAccessToken}`;



      // UPDATE ORIGINAL REQUEST


      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;



      // RETRY QUEUED REQUESTS


      processQueue(
        null,
        newAccessToken,
      );



      // RETRY ORIGINAL REQUEST


      return api(originalRequest);


    } catch (refreshError) {

      console.error(
        "Refresh token failed:",
        refreshError,
      );


      processQueue(
        refreshError,
        null,
      );



      // CLEAR TOKENS


      localStorage.removeItem("scrmToken");
      localStorage.removeItem("scrmRefreshToken");


      // Optional:
      // window.location.href = "/login";


      return Promise.reject(refreshError);


    } finally {

      isRefreshing = false;

    }
  },
);

export default api;