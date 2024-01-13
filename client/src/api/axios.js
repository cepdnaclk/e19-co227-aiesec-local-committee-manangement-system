import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 5000,
});

// intercept requests before it is handled by then or catch
instance.interceptors.request.use(
  (config) => {
    // Retrieve JWT access token from local storage and add to request header
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// intercept responses before it is handled by then or catch
instance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger

    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger

    // const originalRequest = error.config;

    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   // In the case of an infinite request loop if the request is failed again,
    //   // and the server continue to return 401 status code set the _retry flag to true
    //   originalRequest._retry = true;
    //   try {
    //     const refreshToken = localStorage.getItem("refreshToken");

    //     const response = await client.post("/user/token", { refreshToken });
    //     const newAccessToken = response?.data?.accessToken;
    //     localStorage.setItem("accessToken", newAccessToken);

    //     // Retry the original request with the new token
    //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    //     return client(originalRequest);
    //   } catch (err) {
    //     return Promise.reject(error);
    //   }
    // }
    return Promise.reject(error);
  }
);

export default instance;
