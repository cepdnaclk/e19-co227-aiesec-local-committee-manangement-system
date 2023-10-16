import React, { createContext, useState, useContext } from "react";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type SeverityType = "success" | "error" | "warning" | "info";

interface SnackbarStateType {
  open: boolean;
  severity?: SeverityType;
  message?: string;
}

const SnackbarIdleState: SnackbarStateType = {
  open: false,
};

interface NotifyProps {
  severity: SeverityType;
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

  const notify = ({ severity, message }: NotifyProps) => {
    setSnackbarState({
      open: true,
      severity,
      message,
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
      <Alert severity={snackbarState.severity}>{snackbarState.message}</Alert>
    </Snackbar>
  );
};

/* Custom hook for children component to use the notify() function */
export const useNotify = () => {
  const { notify } = useContext(NotificationContext);

  const notifySuccess = (message: string) => {
    notify({ severity: "success", message });
  };

  const notifyError = (message: string) => {
    notify({ severity: "error", message });
  };

  const notifyWarning = (message: string) => {
    notify({ severity: "warning", message });
  };

  const notifyInfo = (message: string) => {
    notify({ severity: "info", message });
  };

  return { notifySuccess, notifyError, notifyWarning, notifyInfo };
};
