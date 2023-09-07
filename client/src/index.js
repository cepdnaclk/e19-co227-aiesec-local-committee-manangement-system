import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { NotificationProvider } from "./context/NotificationContext";
import { AuthContextProvider } from "./context/AuthContext";

// ReactDOM.render is no longer supported in React 18.
// ReactDOM.render(<App />, document.getElementById('root'))

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NotificationProvider>
        <AuthContextProvider>
          <UserProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </UserProvider>
        </AuthContextProvider>
      </NotificationProvider>
    </LocalizationProvider>
  </React.StrictMode>
);
