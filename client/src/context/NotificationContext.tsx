import React, { createContext, useState, useContext } from "react";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type MessageType = "success" | "error" | "warning" | "info";

interface SnackbarStateType {
  open: boolean;
  type: MessageType;
  message: string;
}

const SnackbarIdleState: SnackbarStateType = {
  open: false,
  type: "info",
  message: "",
};

interface NotifyProps {
  type: MessageType;
  message: string;
}

interface NotificationContextType {
  snackbarState: SnackbarStateType;
  handleClose: (event: React.SyntheticEvent | Event, reason?: string) => void;
  notify: (props: NotifyProps) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  snackbarState: SnackbarIdleState,
  handleClose: () => {},
  notify: () => {},
});

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [snackbarState, setSnackbarState] =
    useState<SnackbarStateType>(SnackbarIdleState);

  const notify = ({ type, message }: NotifyProps) => {
    setSnackbarState({
      open: true,
      type: type,
      message: message,
    });
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarState((prevState) => ({ ...prevState, open: false }));
  };

  return (
    <NotificationContext.Provider
      value={{ notify, handleClose, snackbarState }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

/* Notification Component */
export const NotificationBar: React.FC = () => {
  const { handleClose, snackbarState } = useContext(NotificationContext);

  return (
    <Snackbar
      open={snackbarState.open}
      autoHideDuration={4000}
      onClose={handleClose}
    >
      <Alert severity={snackbarState.type}>{snackbarState.message}</Alert>
    </Snackbar>
  );
};

/* Custom hook for children component to use the notify() function */
export const useNotify = () => {
  const { notify } = useContext(NotificationContext);

  const notifySuccess = (message: string) => {
    notify({ type: "success", message });
  };

  const notifyError = (message: string) => {
    notify({ type: "error", message });
  };

  const notifyWarning = (message: string) => {
    notify({ type: "warning", message });
  };

  const notifyInfo = (message: string) => {
    notify({ type: "info", message });
  };

  return { notifySuccess, notifyError, notifyWarning, notifyInfo };
};
