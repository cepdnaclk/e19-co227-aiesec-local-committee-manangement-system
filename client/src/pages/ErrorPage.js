import React from "react";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

/* Display Axios Error Object Details to User */
const ErrorPage = ({ error }) => {
  return (
    <Alert severity="error">
      <Typography>An error has occurred. Please refresh.</Typography>
      <Typography>Code: {error?.response?.status}</Typography>
      <Typography>Message: {error?.response?.data?.message}</Typography>
    </Alert>
  );
};

export default ErrorPage;
