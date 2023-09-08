import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 5000,
});

// Add JWT access token to header
instance.interceptors.request.use((config) => {
  // retrieve token from local storage
  const accessToken = localStorage.getItem("accessToken");

  // Add token to header if it exists
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// Listen to 401 errors and renew the access token automatically
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(error);
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // In the case of an infinite request loop if the request is failed again,
      // and the server continue to return 401 status code set the _retry flag to true
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const response = await instance.post("/user/token", { refreshToken });
        const newAccessToken = response?.data?.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (err) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
