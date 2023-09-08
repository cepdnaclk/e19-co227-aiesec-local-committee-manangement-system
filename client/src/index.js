import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { BrowserRouter } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { NotificationProvider } from "./context/NotificationContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// ReactDOM.render is no longer supported in React 18.
// ReactDOM.render(<App />, document.getElementById('root'))

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NotificationProvider>
        <UserProvider>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <App />
              <ReactQueryDevtools />
            </QueryClientProvider>
          </BrowserRouter>
        </UserProvider>
      </NotificationProvider>
    </LocalizationProvider>
  </React.StrictMode>
);
