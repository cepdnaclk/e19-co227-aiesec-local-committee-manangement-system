import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

// Retrieve user state from local storage at mount
const getInitialUserState = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Retrive token from local storage at mount
const getInitialTokenState = () => {
  const token = localStorage.getItem("token");
  return token ? JSON.parse(token) : "";
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUserState);
  const [token, setToken] = useState(getInitialTokenState);

  // Save user state to local storage when mutated
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // Save token to local storage when mutated
  useEffect(() => {
    localStorage.setItem("token", JSON.stringify(token));
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
