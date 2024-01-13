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
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// ReactDOM.render is no longer supported in React 18.
// ReactDOM.render(<App />, document.getElementById('root'))
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // queries that have no active instances are garbage collected after a delay
      cacheTime: 10 * 60 * 1000, // default: 5 min

      // by default, data when cached is considered stale immediately
      staleTime: 5 * 60 * 1000, // 5 mins
      // stale data is automatically refetched on:
      //    -> query mount
      refetchOnMount: true, // default: true
      //    -> window refocus
      refetchOnWindowFocus: false, // default: true
      //    -> network reconnect
      refetchOnReconnect: false, // default: true
      //    -> manually configured refetch interval
      // refetchInterval: ,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NotificationProvider>
        <UserProvider>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <App />
              <ReactQueryDevtools
                initialIsOpen={false}
                position="bottom-right"
                panelPosition="right"
              />
            </QueryClientProvider>
          </BrowserRouter>
        </UserProvider>
      </NotificationProvider>
    </LocalizationProvider>
  </React.StrictMode>
);
