import React, { useState, useEffect, createContext } from "react";
import axios from "../../api/axios";

import { useNotifyError } from "../NotificationContext";

interface AuthContextType {
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  setAccessToken: () => {},
  setRefreshToken: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const errorNotification = useNotifyError();

  // Get the tokens from local storage
  const [accessToken, setAccessToken] = useState<string>(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string>(
    localStorage.getItem("refreshToken")
  );

  useEffect(() => {
    // Intercept all axios requests and add the token to the Auth Header
    if (accessToken) {
      axios.interceptors.request.use((config) => {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        return config;
      });

      // Listen for 401 errors and refresh the token
      // axios.interceptors.response.use(
      //   (response) => response,
      //   async (error) => {
      //     const originalRequest = error.config;

      //     if (error.response.status === 401 && !originalRequest._retry) {
      //       originalRequest._retry = true;
      //       try {
      //         const response = await axios.post("/user/token", {
      //           refreshToken,
      //         });
      //         const newAccessToken = response?.data?.accessToken;
      //         console.log(newAccessToken);
      //         setAccessToken(newAccessToken);
      //         localStorage.setItem("accessToken", newAccessToken);

      //         // Retry the original request with the new token
      //         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      //         return axios(originalRequest);
      //       } catch (err) {
      //         if (err.response?.status === 401) {
      //           errorNotification(
      //             "Authentication Failed. Please Sign Out and Sign Back In"
      //           );
      //         } else {
      //           errorNotification("Something Went Wrong. Please Retry");
      //         }
      //       }
      //     } else {
      //       // Handle the case where the request has already been retried
      //       errorNotification("Request failed even after token refresh");
      //     }
      //     return Promise.reject(error);
      //   }
      // );
    }
  }, [accessToken, refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        setAccessToken,
        setRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
